import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ClientLayout from "@/layouts/client/ClientLayout";
import { CatalogueService } from "@/services/Catalogue.service";
import { responseSuccess } from "@/utils/Utils";
import CategorieCard from "@/components/client/catalog/CategorieCard";
import CenteredSpinner from "@/components/common/loaders/CenteredSpinner";
import TableEmpty from "@/components/common/TableEmpty";

export default function HomePage() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchCategories = async () => {
      const res = await CatalogueService.listCategories();
      if (mounted && responseSuccess(res)) {
        setCategories(res.data.data || []);
      } else if (mounted) {
        setError(true);
      }
      if (mounted) setLoading(false);
    };
    fetchCategories();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) return <CenteredSpinner />;
  if (error)
    return <TableEmpty title={t("catalog.error_title")} description={t("catalog.error_desc")} />;
  if (categories.length === 0)
    return (
      <TableEmpty
        title={t("catalog.empty_categories_title")}
        description={t("catalog.empty_categories_desc")}
      />
    );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{t("catalog.categories_title")}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((categorie) => (
          <CategorieCard key={categorie.uid} categorie={categorie} />
        ))}
      </div>
    </div>
  );
}

HomePage.getLayout = function getLayout(page) {
  return <ClientLayout>{page}</ClientLayout>;
};
