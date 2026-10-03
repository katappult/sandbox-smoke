import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import { useTranslation } from "react-i18next";
import { Pagination } from "antd";
import ClientLayout from "@/layouts/client/ClientLayout";
import CatalogCard from "@/components/catalogue/CatalogCard";
import CenteredSpinner from "@/components/common/loaders/CenteredSpinner";
import TableEmpty from "@/components/common/TableEmpty";
import { CATALOGUE_FETCH_SIZE, CATALOGUE_PAGE_SIZE, categorieService } from "@/services/Catalogue.service";
import {
    extractItems,
    isFeatured,
    paginate,
    readField,
    resolveUid,
    sortFeaturedFirst
} from "@/components/catalogue/catalogueHelpers";
import styles from "./catalogue.module.css";

export default function CataloguePage() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        let isActive = true;

        categorieService.listEntity(1, CATALOGUE_FETCH_SIZE, "").then((response) => {
            if (!isActive) return;

            setCategories(sortFeaturedFirst(extractItems(response)));
            setIsLoading(false);
        });

        return () => {
            isActive = false;
        };
    }, []);

    const visible = useMemo(
        () => paginate(categories, page, CATALOGUE_PAGE_SIZE),
        [categories, page]
    );

    return (
        <>
            <Head>
                <title>{t("catalogue.public_title")}</title>
            </Head>
            <div className={styles.page}>
                <header className={styles.page_header}>
                    <h1 className={styles.page_title}>{t("catalogue.public_title")}</h1>
                    <p className={styles.page_subtitle}>{t("catalogue.public_subtitle")}</p>
                </header>

                {isLoading && <CenteredSpinner />}

                {!isLoading && categories.length === 0 && (
                    <TableEmpty
                        title={t("catalogue.public_empty_categories_title")}
                        description={t("catalogue.public_empty_categories_desc")}
                    />
                )}

                {!isLoading && categories.length > 0 && (
                    <div className={styles.grid}>
                        {visible.map((categorie) => (
                            <CatalogCard
                                key={resolveUid(categorie)}
                                item={categorie}
                                href={`/catalogue/${resolveUid(categorie)}`}
                                subtitle={readField(categorie, "description")}
                                featured={isFeatured(categorie)}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && categories.length > CATALOGUE_PAGE_SIZE && (
                    <div className={styles.pagination}>
                        <Pagination
                            current={page}
                            pageSize={CATALOGUE_PAGE_SIZE}
                            total={categories.length}
                            onChange={setPage}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

CataloguePage.getLayout = (page) => <ClientLayout>{page}</ClientLayout>;
