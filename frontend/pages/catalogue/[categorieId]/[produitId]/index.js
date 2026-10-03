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
import {
    ANNONCE_VALIDEE,
    CATALOGUE_FETCH_SIZE,
    CATALOGUE_PAGE_SIZE,
    annonceService
} from "@/services/Catalogue.service";
import {
    extractItems,
    isVisibleAnnonce,
    matchesRelation,
    paginate,
    readField,
    resolveUid
} from "@/components/catalogue/catalogueHelpers";
import styles from "../../catalogue.module.css";

export default function ProduitCataloguePage() {
    const { t } = useTranslation();
    const router = useRouter();
    const { categorieId, produitId } = router.query;
    const [annonces, setAnnonces] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        if (!produitId) return undefined;

        let isActive = true;
        setIsLoading(true);

        // `status` : filtre principal côté serveur (annonces publiques).
        annonceService.listEntity(1, CATALOGUE_FETCH_SIZE, "", "", ANNONCE_VALIDEE).then((response) => {
            if (!isActive) return;

            const ofProduit = extractItems(response)
                .filter((annonce) => matchesRelation(annonce, "produit", produitId))
                .filter((annonce) => isVisibleAnnonce(annonce));

            setAnnonces(ofProduit);
            setIsLoading(false);
        });

        return () => {
            isActive = false;
        };
    }, [produitId]);

    const visible = useMemo(
        () => paginate(annonces, page, CATALOGUE_PAGE_SIZE),
        [annonces, page]
    );

    return (
        <>
            <Head>
                <title>{t("catalogue.public_annonces_title")}</title>
            </Head>
            <div className={styles.page}>
                <nav className={styles.breadcrumb}>
                    <Link href="/catalogue" className={styles.breadcrumb_link}>
                        {t("catalogue.public_title")}
                    </Link>
                    <span>/</span>
                    <Link href={`/catalogue/${categorieId}`} className={styles.breadcrumb_link}>
                        {t("catalogue.public_products_title")}
                    </Link>
                    <span>/</span>
                    <span>{t("catalogue.public_annonces_title")}</span>
                </nav>

                {isLoading && <CenteredSpinner />}

                {!isLoading && annonces.length === 0 && (
                    <TableEmpty
                        title={t("catalogue.public_empty_annonces_title")}
                        description={t("catalogue.public_empty_annonces_desc")}
                    />
                )}

                {!isLoading && annonces.length > 0 && (
                    <div className={styles.grid}>
                        {visible.map((annonce) => (
                            <CatalogCard
                                key={resolveUid(annonce)}
                                item={annonce}
                                price={readField(annonce, "prix")}
                                subtitle={readField(annonce, "description")}
                            />
                        ))}
                    </div>
                )}

                {!isLoading && annonces.length > CATALOGUE_PAGE_SIZE && (
                    <div className={styles.pagination}>
                        <Pagination
                            current={page}
                            pageSize={CATALOGUE_PAGE_SIZE}
                            total={annonces.length}
                            onChange={setPage}
                            showSizeChanger={false}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

ProduitCataloguePage.getLayout = (page) => <ClientLayout>{page}</ClientLayout>;
