import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button, Input, Spin, Table, Tooltip, notification} from "antd";
import {EditOutlined, EyeOutlined, SearchOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {ProduitService} from "@/services/generated/Produit.services";
import {responseSuccess} from "@/utils";
import TableEmpty from "@/components/common/TableEmpty";
import ToggleCell from "@/components/admin/catalogue/ToggleCell";
import {EMPTY_VALUE, applyBoolean, isProductOfCategorie, togglePayload} from "@/components/admin/catalogue/catalogueUtils";
import s from "@/styles/components/CatalogueAdmin.module.css";

const ALL = "ALL";
const PAGE_SIZE = 10;
const FILTER_FETCH_SIZE = 200;
const TOGGLE_COLUMN_WIDTH = 190;
const ACTION_COLUMN_WIDTH = 110;

const ADD_PAGE_URL = "/generated/produit/add";
const EDIT_PAGE_URL = "/generated/produit/edit/";
const INFO_PAGE_URL = "/generated/produit/info/";

/**
 * `categorieUid` renseigné => liste des produits rattachés à cette catégorie
 * (master-detail piloté par l'état local de CategorieAdminList).
 * Le service généré n'expose pas de filtre sur la relation : la page est chargée
 * puis filtrée sur `categorie`.
 */
export default function ProduitAdminList({categorieUid = null}) {
    const {t} = useTranslation();
    const router = useRouter();
    const isFiltered = Boolean(categorieUid);

    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [pendingUid, setPendingUid] = useState(null);

    useEffect(() => {
        loadItems(currentPage).then(() => {
        });
    }, [currentPage, searchValue, categorieUid]);

    const fetchItems = (page) => {
        const search = searchValue.trim();
        const index = isFiltered ? 0 : page - 1;
        const size = isFiltered ? FILTER_FETCH_SIZE : PAGE_SIZE;

        if (search) {
            return ProduitService.searchEntity(index, size, search, "", ALL);
        }

        return ProduitService.listEntity(index, size, "", "", ALL);
    };

    const applyResponse = (response) => {
        const rawItems = response.data.dataList ?? [];
        const rows = isFiltered
            ? rawItems.filter((item) => isProductOfCategorie(item, categorieUid))
            : rawItems;

        setItems(rows);
        setTotalElement(isFiltered ? rows.length : (response.data.meta?.totalElements ?? 0));
    };

    const loadItems = async (page) => {
        setLoading(true);
        const response = await fetchItems(page);

        if (responseSuccess(response)) {
            applyResponse(response);
        } else {
            notification.error({message: t("catalogue.load_error")});
        }

        setLoading(false);
    };

    const toggleField = async (record, field, value) => {
        setPendingUid(record.uid);
        const response = await ProduitService.updateEntity(record.uid, togglePayload(record, field, value));

        if (responseSuccess(response)) {
            setItems((rows) => applyBoolean(rows, record.uid, field, value));
            notification.success({message: t("catalogue.update_success")});
        } else {
            notification.error({message: t("catalogue.update_error")});
        }

        setPendingUid(null);
    };

    const handleSearch = (event) => {
        setSearchValue(event.target.value);
        setCurrentPage(1);
    };

    const booleanColumn = (field, titleKey, labelOnKey, labelOffKey) => ({
        key: field,
        dataIndex: field,
        title: t(titleKey),
        width: TOGGLE_COLUMN_WIDTH,
        align: "center",
        render: (value, record) => (
            <ToggleCell
                value={value}
                loading={pendingUid === record.uid}
                labelOn={t(labelOnKey)}
                labelOff={t(labelOffKey)}
                onChange={(checked) => toggleField(record, field, checked)}
            />
        ),
    });

    const columns = [
        {
            key: "titre",
            dataIndex: "titre",
            title: t("catalogue.col_titre"),
            ellipsis: true,
            render: (value) => <span className={s.cell_title}>{value || EMPTY_VALUE}</span>,
        },
        {
            key: "description",
            dataIndex: "description",
            title: t("catalogue.col_description"),
            ellipsis: true,
            render: (value) => value || EMPTY_VALUE,
        },
        booleanColumn("featured", "catalogue.col_featured", "catalogue.featured_on", "catalogue.featured_off"),
        booleanColumn("active", "catalogue.col_active", "catalogue.active_on", "catalogue.active_off"),
        {
            key: "action",
            title: t("catalogue.col_actions"),
            width: ACTION_COLUMN_WIDTH,
            align: "right",
            render: (text, record) => (
                <div className={s.row_actions}>
                    <Tooltip title={t("catalogue.edit_btn")}>
                        <Button type="text" size="small" icon={<EditOutlined/>}
                                onClick={() => router.push(EDIT_PAGE_URL + record.uid)}/>
                    </Tooltip>
                    <Tooltip title={t("catalogue.details_btn")}>
                        <Button type="text" size="small" icon={<EyeOutlined/>}
                                onClick={() => router.push(INFO_PAGE_URL + record.uid)}/>
                    </Tooltip>
                </div>
            ),
        },
    ];

    const pagination = isFiltered
        ? {
            pageSize: PAGE_SIZE,
            hideOnSinglePage: true,
            showSizeChanger: false,
        }
        : {
            current: currentPage,
            pageSize: PAGE_SIZE,
            total: totalElement,
            hideOnSinglePage: true,
            showSizeChanger: false,
            showTotal: (total) => t("common.elements_count", {count: total}),
            onChange: (page) => setCurrentPage(page),
        };

    return (
        <div className={s.panel}>
            <div className={s.toolbar}>
                <Input
                    allowClear
                    prefix={<SearchOutlined style={{fontSize: 16}}/>}
                    placeholder={t("catalogue.search_placeholder")}
                    onChange={handleSearch}
                    className={s.search_input}
                />
                <Button type="primary" onClick={() => router.push(ADD_PAGE_URL)}>
                    {t("catalogue.create_btn")}
                </Button>
            </div>

            <Table
                rowKey="uid"
                columns={columns}
                dataSource={items}
                loading={isLoading}
                size="small"
                locale={{
                    emptyText: isLoading
                        ? <Spin size="large" style={{padding: "48px 0"}}/>
                        : <TableEmpty
                            title={t("catalogue.produits_empty")}
                            description={t("catalogue.empty_desc")}
                        />,
                }}
                pagination={pagination}
            />
        </div>
    );
}
