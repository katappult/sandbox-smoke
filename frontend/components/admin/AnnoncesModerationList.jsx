import { useEffect, useState } from "react";
import { Table, Button, Tag, Image, notification } from "antd";
import { useTranslation } from "react-i18next";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { AnnonceService } from "@/services/generated/Annonce.services";
import { serviceConfig } from "@/services/utils/service.config";
import { responseSuccess, toThumbFullURL } from "@/utils/Utils";

const PAGE_SIZE = 10;

const MODERATION_ACTIONS = {
  validate: "validate",
  refuse: "refuse",
};

const STATUS_META = {
  NEW: { labelKey: "annonces.status.pending", color: "gold" },
  ACCEPTED: { labelKey: "annonces.status.accepted", color: "green" },
  REFUSED: { labelKey: "annonces.status.refused", color: "red" },
};

function mapLifecycleState(record) {
  return record.state ?? record.currentState ?? record.lifecycleState ?? "";
}

function isPending(record) {
  return mapLifecycleState(record) === "NEW";
}

function getThumbUrl(record) {
  const thumb =
    record?.thumbs?.[0]?.url ||
    record?.thumb?.url ||
    record?.thumbUrl ||
    record?.thumbnail ||
    "";
  return toThumbFullURL(thumb, 150);
}

function TruncatedText({ text, maxLength = 80 }) {
  if (!text) return "—";
  const truncated = text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
  return <span title={text}>{truncated}</span>;
}

function ProduitCell({ produit }) {
  return <span>{produit?.nom || "—"}</span>;
}

export default function AnnoncesModerationList() {
  const { t } = useTranslation();
  const [annonces, setAnnonces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchAnnonces = async (targetPage = page) => {
    setLoading(true);
    try {
      const params = {
        page: targetPage - 1,
        size: PAGE_SIZE,
      };
      const res = await AnnonceService.listEntity(params);

      if (!responseSuccess(res)) {
        notification.error({ message: t("common.error") });
        return;
      }

      const payload = res.data?.payload ?? {};
      const content = Array.isArray(payload.content) ? payload.content : [];
      setAnnonces(content);
      setTotal(payload.totalElements ?? payload.total ?? 0);
    } catch (error) {
      console.error("Failed to fetch annonces", error);
      notification.error({ message: t("common.error") });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnonces(1);
  }, []);

  const handleTableChange = (pagination) => {
    const nextPage = pagination.current || 1;
    setPage(nextPage);
    fetchAnnonces(nextPage);
  };

  const handleModerate = async (annonce, action) => {
    if (!isPending(annonce)) return;

    const id = annonce.uid ?? annonce.fullId;
    if (!id) {
      notification.error({ message: t("annonces.missingId") });
      return;
    }

    const url = `/api/v1/annonce/${id}/${action}`;

    setLoading(true);
    try {
      const res = await serviceConfig._doPost(url, {});

      if (responseSuccess(res)) {
        notification.success({ message: t("annonces.actionSuccess") });
        await fetchAnnonces(page);
      } else {
        notification.error({ message: t("annonces.actionFailed") });
      }
    } catch (error) {
      console.error(error);
      notification.error({ message: t("annonces.actionFailed") });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t("annonces.status"),
      dataIndex: "state",
      key: "state",
      render: (_, record) => {
        const status = mapLifecycleState(record);
        const meta = STATUS_META[status] ?? {
          labelKey: "annonces.status.unknown",
          color: "default",
        };
        return <Tag color={meta.color}>{t(meta.labelKey)}</Tag>;
      },
    },
    {
      title: t("annonces.title"),
      dataIndex: "titre",
      key: "titre",
      render: (text) => <TruncatedText text={text} maxLength={60} />,
    },
    {
      title: t("annonces.description"),
      dataIndex: "description",
      key: "description",
      render: (text) => <TruncatedText text={text} maxLength={80} />,
    },
    {
      title: t("annonces.price"),
      dataIndex: "prix",
      key: "prix",
      render: (prix) =>
        prix
          ? new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(prix)
          : "—",
    },
    {
      title: t("annonces.photo"),
      key: "photo",
      render: (_, record) => {
        const url = getThumbUrl(record);
        return url && url !== "/" ? (
          <Image
            src={url}
            width={48}
            height={48}
            style={{ objectFit: "cover" }}
          />
        ) : null;
      },
    },
    {
      title: t("annonces.product"),
      key: "produit",
      render: (_, record) => <ProduitCell produit={record.produit} />,
    },
    {
      title: t("annonces.actions"),
      key: "actions",
      render: (_, record) => {
        if (!isPending(record)) return null;

        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Button
              size="small"
              type="primary"
              icon={<CheckOutlined />}
              onClick={() => handleModerate(record, MODERATION_ACTIONS.validate)}
            >
              {t("annonces.validate")}
            </Button>
            <Button
              size="small"
              danger
              icon={<CloseOutlined />}
              onClick={() => handleModerate(record, MODERATION_ACTIONS.refuse)}
            >
              {t("annonces.refuse")}
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <Table
      rowKey={(record) => record.uid ?? record.fullId ?? record.id}
      columns={columns}
      dataSource={annonces}
      loading={loading}
      pagination={{
        current: page,
        pageSize: PAGE_SIZE,
        total,
        showSizeChanger: false,
      }}
      onChange={handleTableChange}
      scroll={{ x: true }}
    />
  );
}
