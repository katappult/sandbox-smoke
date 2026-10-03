import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Button, Input, Spin, Table, Tooltip, notification} from "antd";
import {ArrowLeftOutlined, EditOutlined, EyeOutlined, SearchOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {CategorieService} from "@/services/generated/Categorie.services";
import {responseSuccess} from "@/utils";
import TableEmpty from "@/components/common/TableEmpty";
import ToggleCell from "@/components/admin/catalogue/ToggleCell";
import ProduitAdminList from "@/components/admin/catalogue/ProduitAdminList";
import {EMPTY_VALUE, applyBoolean, togglePayload} from "@/components/admin/catalogue/catalogueUtils";
import s from "@/styles/components/CatalogueAdmin.module.css";

const ALL = "ALL";
const PAGE_SIZE = 10;
const TOGGLE_COLUMN_WIDTH = 190;
const ACTION_COLUMN_WIDTH = 140;

const ADD_PAGE_URL = "/generated/categorie/add";
const EDIT_PAGE_URL = "/generated/categorie/edit/";
const INFO_PAGE_URL = "/generated/categorie/info/";

export default function CategorieAdminList() {
    const {t} = useTranslation();
    const router = useRouter();

    const [items, setItems] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchValue, setSearchValue] = useState("");
    const [pendingUid, setPendingUid] = useState(null);

    // Navigation master-detail : état local, pas de routing (convention frontend/CLAUDE.md)
    const [selectedCategorie, setSelectedCategorie] = useState(null);

    useEffect(() => {
        loadItems(currentPage).then(() => {
        });
    }, [currentPage, searchValue]);

    const loadItems = async (page) => {
        setLoading(true);

        const search = searchValue.trim();
        const response = search
            ? await CategorieService.searchEntity(page - 1, PAGE_SIZE, search, "", ALL)
            : await CategorieService.listEntity(page - 1, PAGE_SIZE, "", "", ALL);

        if (responseSuccess(response)) {
            setItems(response.data.dataList ?? []);
            setTotalElement(response.data.meta?.totalElements ?? 0);
        } else {
            notification.error({message: t("catalogue.load_error")});
        }

        setLoading(false);
    };

    const toggleField = async (record, field, value) => {
        setPendingUid(record.uid);
        const response = await CategorieService.updateEntity(record.uid, togglePayload(record, field, value));

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
                    <Tooltip title={t("catalogue.view_products")}>
                        <Button type="text" size="small" icon={<UnorderedListOutlined/>}
                                onClick={() => setSelectedCategorie(record)}/>
                    </Tooltip>
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

    const renderCategorieTable = () => (
        <>
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
                            title={t("catalogue.categories_empty")}
                            description={t("catalogue.empty_desc")}
                        />,
                }}
                pagination={{
                    current: currentPage,
                    pageSize: PAGE_SIZE,
                    total: totalElement,
                    hideOnSinglePage: true,
                    showSizeChanger: false,
                    showTotal: (total) => t("common.elements_count", {count: total}),
                    onChange: (page) => setCurrentPage(page),
                }}
            />
        </>
    );

    const renderProduitsPanel = () => (
        <>
            <div className={s.detail_header}>
                <button type="button" className={s.back_btn} onClick={() => setSelectedCategorie(null)}>
                    <ArrowLeftOutlined style={{fontSize: 14}}/>
                    {t("catalogue.back_to_categories")}
                </button>
                <span className={s.detail_title}>
                    {t("catalogue.products_of", {titre: selectedCategorie.titre || EMPTY_VALUE})}
                </span>
            </div>

            <ProduitAdminList categorieUid={selectedCategorie.uid}/>
        </>
    );

    return (
        <div className={s.panel}>
            {selectedCategorie ? renderProduitsPanel() : renderCategorieTable()}
        </div>
    );
}
