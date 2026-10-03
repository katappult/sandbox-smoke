import { useEffect, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { Pagination } from "antd";
import ClientLayout from "@/layouts/client/ClientLayout";
import CatalogCard from "@/components/catalogue/CatalogCard";
import CenteredSpinner from "@/components/common/loaders/CenteredSpinner";
import TableEmpty from "@/components/common/TableEmpty";
import { CATALOGUE_FETCH_SIZE, CATALOGUE_PAGE_SIZE, produitService } from "@/services/Catalogue.service";
import {
    extractItems,
    isFeatured,
    matchesRelation,
    paginate,
    readField,
    resolveUid,
    sortFeaturedFirst
} from "@/components/catalogue/catalogueHelpers";
import styles from "../catalogue.module.css";

export default function CategorieCataloguePage() {
    const { t } = useTranslation();
    const router = useRouter();
    const categorieId = router.query.categorieId;
    const [produits, setProduits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!categorieId) return undefined;

        let isActive = true;
        setIsLoading(true);

        produitService.listEntity(1, CATALOGUE_FETCH_SIZE, "").then((response) => {
            if (!isActive) return;

            const ofCategorie = extractItems(response)
                .filter((produit) => matchesRelation(produit, "categorie", categorieId));

            setProduits(sortFeaturedFirst(ofCategorie));
            setIsLoading(false);
        });

        return () => {
            isActive = false;
        };
    }, [categorieId]);

    const visible = useMemo(
        () => paginate(produits, page, CATALOGUE_PAGE_SIZE),
        [produits, page]
    );

    return (
        <>
            <Head>
                <title>{t("catalogue.public_products_title")}</title>
            </Head>
            <div className={styles.page}>
                <nav className={styles.breadcrumb}>
                    <Link href="/catalogue" className={styles.breadcrumb_link}>
                        {t("catalogue.public_title")}
                    </Link>
                    <span>/</span>
                    <span>{t("catalogue.public_products_title")}</span>
                </nav>

                {isLoading && <CenteredSpinner />}

                {!isLoading && produits.length === 0 && (
                    <TableEmpty
                        title={t("catalogue.public_empty_products_title")}
                        description={t("catalogue.public_empty_products_desc")}
                    />
                )}

                {!isLoading && produits.length > 0 && (
                    <div className={styles.grid}>
                        {visible.map((produit) => (
                            <CatalogCard
                                key={resolveUid(produit)}
                                item={produit}
                                href={`/catalogue/${categorieId}/${resolveUid(produit)}`}
                                subtitle={readField(produit, "description")}
                                featured={isFeatured(produit)}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && produits.length > CATALOGUE_PAGE_SIZE && (
                    <div className={styles.pagination}>
                        <Pagination
                            current={page}
                            pageSize={CATALOGUE_PAGE_SIZE}
                            total={produits.length}
                            onChange={setPage}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

CategorieCataloguePage.getLayout = (page) => <ClientLayout>{page}</ClientLayout>;
