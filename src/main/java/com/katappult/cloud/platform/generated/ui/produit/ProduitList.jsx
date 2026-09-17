import React, {useEffect, useState, useMemo} from "react";
import {useRouter} from "next/router";
import {Button, Dropdown, Input, Select, Spin, Table} from "antd";
import {Add, DeleteOutlined, EditOutlined, MoreVert, SearchOutlined, UploadOutlined} from "@mui/icons-material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ArrowForwardOutlinedIcon from "@mui/icons-material/ArrowForwardOutlined";
import {ProduitService} from "@/services/generated/Produit.services";
import FormStyle from "@/styles/components/FormStyle.module.css";
import p from "@/styles/pages/Profile.module.css";
import {
    convertDateShort,
    toThumbFullURL,
    convertDateTimeToDateWidthHours_and_Minute,
    getSortDefinitionOfTable,
    notificationErrorDeleting,
    notificationSuccessDeleting,
    responseSuccess
} from "@/utils";
import ProduitDetailsDrawer from "@/components/generated/produit/ProduitDrawer";
import Badge from "@/components/common/Badge";
import ImportCSV from "@/components/common/massImport/ImportCSV";
import TableEmpty from "@/components/common/TableEmpty";
import {EyeOutlined} from "@ant-design/icons";
//IMPORT

const INFO_PAGE_URL = "/generated/produit/info/";
const EDIT_PAGE_URL = "/generated/produit/edit/";
const ADD_PAGE_URL = "/generated/produit/add";

const DRAWER_TITLE = "Details";
const SORT_DIRECTIONS = ["ascend", "descend", "ascend"];
const PAGINATION_POSITION = ["bottomRight"];
const ALL = "ALL";

export default function ProduitList() {

    const router = useRouter();
    const [visibleImport, setVisibleImport] = useState(false);
    const [isLoading, setLoading] = useState(true);
    const [isDrawerVisible, setDrawerVisible] = useState(false);
    const [listItems, setListItems] = useState([]);
    const [sortingFromDatatable, setSortingFromDatatable] = useState({});
    const [paginationSize, setPaginationSize] = useState(10);
    const [totalElement, setTotalElement] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [selectedStatuses, setSelectedStatuses] = useState([]);
    const STATUS_OPTIONS = ["NEW", "ACCEPTED", "REFUSED"];
    {/*default states*/
    }
    const PAGE_SIZE = 5;

    const column = [

         {
    key: 'image',
    dataIndex: 'mainIllustration',
    width:60,
    render: (text, record) => <div className={FormStyle.table_value_image_container}>
        {record.mainIllustration && <img src={record.mainIllustration} alt="" className={FormStyle.table_value_image}/>}
        {!record.mainIllustration && <img src={'/images/project-deployed.png'} className={FormStyle.table_value_image}/>}
    </div>
},
{/*table columns_before*/},

             {
          key: "titre",
          dataIndex: "titre",
          title: "Titre",
          sorter:{column: "titre"}
     },
     {
          key: "description",
          dataIndex: "description",
          title: "Description",
          sorter:{column: "description"}
     },
     {
          key: "prix",
          dataIndex: "prix",
          title: "Prix",
          sorter:{column: "prix"}
     },
     {
          key: "enStock",
          dataIndex: "enStock",
          title: "En Stock",
          sorter:{column: "enStock"}
     },
{
    key: "status",
    dataIndex: "status",
    title: "Status",
    sorter: {column: "status"},
    render: (text, record) => <Badge text={record.status} accent/>,
},
{/*table columns*/},
        {
            key: "action",
            dataIndex: "action",
            title: "",
            width: 48,
            align: "center",
            render: (text, record) => actionTemplate(record),
        },
    ];

    useEffect(() => {
        doRequestLoadItems(1).then(r => {
        });
    }, []);

    useEffect(() => {
        doRequestLoadItems(currentPage).then(r => {
        });
    }, [currentPage, sortingFromDatatable, selectedStatuses]);

    useEffect(() => {
        if (searchValue) {
            searchFor(searchValue);
        } else {
            doRequestLoadItems(1).then(r => {
            });
        }
    }, [searchValue]);

    const handleStatusChange = (values) => {
        setSelectedStatuses(values);
        setCurrentPage(1);
    }

    const doRequestLoadItems = async (page) => {
        setLoading(true);

        const sort = getSortDefinitionOfTable(sortingFromDatatable);
        const statusFilter = selectedStatuses.length === 0 ? ALL : selectedStatuses.join(",");
        const response = await ProduitService.listEntity(page - 1, PAGE_SIZE, sort, "", statusFilter);

        if (responseSuccess(response)) {
            setListItems(response.data.dataList);
            setTotalElement(response.data.meta.totalElements);
        }

        setLoading(false);
    }

    const massImport = () => {
        setVisibleImport(true)
    }

    const searchItems = async (searchTerm) => {
        setLoading(true);

        const sort = getSortDefinitionOfTable(sortingFromDatatable);
        const statusFilter = selectedStatuses.length === 0 ? ALL : selectedStatuses.join(",");
        const response = await ProduitService.searchEntity(0, PAGE_SIZE, searchTerm, sort, statusFilter);

        if (responseSuccess(response)) {
            setListItems(response.data.dataList);
            setTotalElement(response.data.meta.totalElements);
        }

        setLoading(false);
    }

    const handleTableChange = (pagination, filters, sorter) => {
        const params = {};
        if (sorter.hasOwnProperty("column")) {
            params.order = {field: sorter.column, dir: sorter.order};
        }

        setSortingFromDatatable(sorter);
        setCurrentPage(pagination.current);
    }

    const deleteItem = async (uid, event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        const response = await ProduitService.deleteEntity(uid);
        if (!responseSuccess(response)) {
            notificationErrorDeleting();
        } else {
            doRequestLoadItems(currentPage);
            notificationSuccessDeleting();
        }
    }

    const handleSearch = (value) => {
        setSearchValue(value.target.value);
    }

    const searchFor = (value) => {
        searchItems(value);
    }

    const tableData = useMemo(() => (listItems ?? []).map((item, index) => ({
        ...item,
        key: index,
        status: item.lifecycleState,
        referenceNumber: item.number,
        item,
        mainIllustration: item.allIllustrations?.length > 0 ? toThumbFullURL(item.allIllustrations[0]) : null,
        allIllustrations: item.allIllustrations,
        createDate: item.createDate ? convertDateTimeToDateWidthHours_and_Minute(item.createDate) : ""
    })), [listItems]);

    const paginationItemRender = (_, type, originalElement) => {
        if (type === "prev") {
            return (
                <ArrowBackOutlinedIcon/>
            );
        }
        if (type === "next") {
            return (
                <ArrowForwardOutlinedIcon/>
            );
        }
        return originalElement;
    };

    const actionTemplate = (data) => {
        const menuItems = [
            {
                key: "details",
                label: "Details",
                icon: <EyeOutlined fontSize="small"/>,
                onClick: ({domEvent}) => forwardInfo(domEvent, data.uid),
            },
            {
                key: "edit",
                label: "Modifier",
                icon: <EditOutlined fontSize="small"/>,
                onClick: ({domEvent}) => forwardEdit(domEvent, data.uid),
            },
            {
                key: "delete",
                label: "Supprimer",
                icon: <DeleteOutlined fontSize="small"/>,
                danger: true,
                onClick: ({domEvent}) => deleteItem(data.uid, domEvent),
            },
        ];

        return (
            <Dropdown menu={{items: menuItems}} trigger={["click"]} placement="bottomRight">
                <button
                    className={FormStyle.table_button_action}
                    onClick={(e) => e.stopPropagation()}
                >
                    <MoreVert fontSize="small"/>
                </button>
            </Dropdown>
        );
    }

    {/*templates*/}

    const hideDetails = () => {
        setSelectedItem(null);
        setDrawerVisible(false);
    }

    const locale = {
        emptyText: isLoading
            ? <Spin size="large" style={{padding: "48px 0"}}/>
            : <TableEmpty
                title="Aucun élément trouvé"
                description="Il n'existe aucun élément pour le moment. Créez-en un pour commencer."
                action={
                    <Button type="primary" onClick={() => router.push(ADD_PAGE_URL)}>
                        Créer un élément
                    </Button>
                }
            />,
    }

    const forwardEdit = (event, uid) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        return router.push(EDIT_PAGE_URL + uid);
    }

    const forwardInfo = (event, uid) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        return router.push(INFO_PAGE_URL + uid);
    }

    return (
        <>
            <ImportCSV visible={visibleImport}
                       entity={"Produit"}
                       reload={() => doRequestLoadItems(1)}
                       onHide={() => setVisibleImport(false)}/>

            <div className={"flex_col flex_space_between"} style={{marginBottom:10}}>
                <Input prefix={<SearchOutlined style={{fontSize: 16, color: "var(--text-muted)"}}/>}
                       placeholder={'Search element'} onChange={handleSearch}
                       className={`${FormStyle.input_form} ${FormStyle.input_search}`}
                       style={{width: 240, alignSelf: "center"}}/>
                <div className={FormStyle.wrapper_header_right_section_container}>

                    <div className="flex items-center bg-[var(--surface-subtle)] rounded-full p-0.5 gap-0.5">
                        <button
                            type="button"
                            onClick={() => handleStatusChange([])}
                            className={
                                selectedStatuses.length === 0
                                    ? "px-3 py-1 text-xs font-semibold rounded-full bg-[var(--content-bg)] text-[var(--text-primary)] shadow-sm transition-all cursor-pointer border-0"
                                    : "px-3 py-1 text-xs font-medium rounded-full bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer border-0"
                            }
                        >
                            Tous
                        </button>
                        {STATUS_OPTIONS.map((status) => (
                            <button
                                key={status}
                                type="button"
                                onClick={() => handleStatusChange([status])}
                                className={
                                    selectedStatuses[0] === status
                                        ? "px-3 py-1 text-xs font-semibold rounded-full bg-[var(--content-bg)] text-[var(--text-primary)] shadow-sm transition-all cursor-pointer border-0"
                                        : "px-3 py-1 text-xs font-medium rounded-full bg-transparent text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-all cursor-pointer border-0"
                                }
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    <button className={p.btn_ghost} onClick={massImport}>
                        <UploadOutlined style={{fontSize: 14}}/>
                        Importer
                    </button>
                    <button className={p.btn_primary} onClick={() => router.push(ADD_PAGE_URL)}>
                        <Add style={{fontSize: 16}}/>
                        Nouvel élément
                    </button>
                </div>
            </div>

            <div className={FormStyle.container}>
                {/* table */}
                <div className={FormStyle.tableContainer}>
                    <Table
                        locale={locale}
                        className={FormStyle.item_table}
                        dataSource={tableData}
                        columns={column}
                        onRow={(record) => ({
                            onClick: (event) => {
                                setSelectedItem(record);
                                setDrawerVisible(true);
                            },
                        })}
                        size="small"
                        sortDirections={SORT_DIRECTIONS}
                        onChange={handleTableChange}
                        pagination={{
                            current: currentPage,
                            pageSize: paginationSize,
                            hideOnSinglePage: true,
                            total: totalElement,
                            showLessItems: true,
                            showTotal: () => totalElement + " Elements",
                            className: FormStyle.table_pagination,
                            showSizeChanger: false,
                            position: [...PAGINATION_POSITION],
                            itemRender: paginationItemRender,
                        }}
                    />
                </div>
            </div>

            {isDrawerVisible && <ProduitDetailsDrawer
                isVisible={isDrawerVisible}
                hideDetails={hideDetails}
                refreshListView={() => doRequestLoadItems(currentPage)}
                drawerTitle={DRAWER_TITLE}
                selectedElement={selectedItem}/>}
        </>
    );
}