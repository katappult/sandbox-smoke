import AnnoncesModerationList from "@/components/admin/AnnoncesModerationList";
import AdminPage from "@/pages/admin";

export default function AnnoncesModerationPage() {
    return <AnnoncesModerationList />;
}

AnnoncesModerationPage.getLayout = function getLayout(page) {
    return AdminPage.getLayout(page);
};
