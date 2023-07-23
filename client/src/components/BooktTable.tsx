import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Space, Table, Tag, Input, Button, Modal, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./BookTabLe.scss";
import { httpClient } from "../client/HttpClient";
import { toast } from "react-toastify";

interface IBook {
  name: string;
  book_cover: string;
  isbn: string;
  paper_type: string;
  numberof_pages: string;
  price: string;
  publisher: string;
  writer: string;
  site: string;
  size: string;
  created: string;
}

interface ILoading {
  mounted: boolean;
  kitapsepeti: boolean;
  kitapyurdu: boolean;
}

interface IRequestResponse {
  message: string;
  books: any[];
  element: "kitapsepeti" | "kitapyurdu";
}

const BooktTable = () => {
  const [loading, setLoading] = useState<ILoading>({
    kitapsepeti: false,
    kitapyurdu: false,
    mounted: true,
  });
  const [visible, setVisible] = useState<Omit<ILoading, "mounted">>({
    kitapsepeti: false,
    kitapyurdu: false,
  });
  const [data, setData] = useState<IBook[]>([]);
  const [tempData, setTempData] = useState<IBook[]>([]);
  const columns: ColumnsType<IBook> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Writer",
      dataIndex: "writer",
      key: "writer",
      sorter: (a, b) => a.writer.localeCompare(b.writer),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      sorter: (a, b) => parseFloat(a.price) - parseFloat(b.price),
    },
    {
      title: "Publisher",
      dataIndex: "publisher",
      key: "publisher",
    },
    {
      title: "Isbn",
      dataIndex: "isbn",
      key: "isbn",
    },
    {
      title: "Paper Type",
      dataIndex: "paper_type",
      key: "paper_type",
    },
    {
      title: "Number of pages",
      dataIndex: "numberof_pages",
      key: "numberof_pages",
    },
    {
      title: "site",
      dataIndex: "site",
      key: "site",
    },
    {
      title: "size",
      dataIndex: "size",
      key: "size",
    },
  ];

  const setAllData = () => {
    httpClient
      .get("/all")
      .then((val) => {
        setData(val.data);
        setTempData(val.data);
        setLoading({
          ...loading,
          mounted: false,
        });
      })
      .catch((err) => {
        toast.error("get request unsuccessfull", {
          position: "top-right", // Bildirimin konumu (top-left, top-right, bottom-left, bottom-right)
          autoClose: 3000, // Bildirimin otomatik kapanma süresi (ms cinsinden)
          hideProgressBar: false, // İlerleme çubuğunu gizle
          closeOnClick: true, // Bildirime tıklandığında otomatik olarak kapat
          pauseOnHover: true, // Bildirimin üzerine gelindiğinde otomatik kapat
          draggable: true, // Bildirimi sürükleyerek konumunu değiştirme
          progress: undefined, // Otomatik kapanma süresi boyunca ilerleme çubuğu için özel stil
        });
      });
  };

  useEffect(() => {
    setAllData()
  }, []);

  const searchInput = (value: string) => {
    const result = tempData.filter(
      (item) => item.name.toLowerCase().search(value.toLowerCase()) != -1
    );
    setData(result);
  };

  const lastUpdate = useMemo(() => {
    if (data.length != 0) {
      const items = data[0]?.created.split(".")[0].split("T");
      return items[0] + " -  " + items[1];
    }
    return "";
  }, [data]);

  const handleOkKitapYurdu = async () => {
    try {
      setLoading({
        ...loading,
        kitapyurdu: true,
      });
      setVisible({
        ...visible,
        kitapyurdu: false,
      });
      const response = await httpClient.get("/kitapyurdu");
      setLoading({
        ...loading,
        kitapyurdu: false,
      });
      toast.success("Successful web scraping of Kitap Yurdu", {
        position: "top-right",
        autoClose: 2000,
      });
      setAllData()
    } catch (err: any) {
      toast.error("Unsuccessful web scraping of Kitap Yurdu", {
        position: "top-right",
        autoClose: 2000,
      });
      setLoading({
        ...loading,
        kitapyurdu: false,
      });
      setVisible({
        ...visible,
        kitapyurdu: false,
      });
    }
  };

  const handleOkKitapSepeti = async () => {
    try {
      setLoading({
        ...loading,
        kitapsepeti: true,
      });
      setVisible({
        ...visible,
        kitapsepeti: false,
      });
      const response = await httpClient.get("/kitapsepeti");
      setLoading({
        ...loading,
        kitapsepeti: false,
      });
      toast.success("Successful web scraping of Kitap Sepeti", {
        position: "top-right",
        autoClose: 2000,
      });
      setAllData()
    } catch (err: any) {
      toast.error("Unsuccessful web scraping of Kitap Sepeti", {
        position: "top-right",
        autoClose: 2000,
      });
      setLoading({
        ...loading,
        kitapsepeti: false,
      });
      setVisible({
        ...visible,
        kitapsepeti: false,
      });
    }
  };

  if (loading.mounted) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div
      style={{
        paddingLeft: "120px",
        paddingRight: "120px",
        marginTop: "80px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <p style={{ margin: "0" }}>
          {" "}
          <b>Last Update</b> : {lastUpdate}
        </p>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div>
            <Button
              type="primary"
              loading={loading.kitapyurdu}
              style={{ marginRight: "20px" }}
              onClick={() => {
                setVisible({
                  ...visible,
                  kitapyurdu: true,
                });
              }}
            >
              KitapYurdu Update
            </Button>
            <Button
              className="kitap_sepeti"
              loading={loading.kitapsepeti}
              onClick={() => {
                setVisible({
                  ...visible,
                  kitapsepeti: true,
                });
              }}
            >
              {" "}
              KitapSepeti Update
            </Button>
          </div>
          <Input
            size="middle"
            style={{ width: "max-content" }}
            placeholder="search"
            onChange={({ target: { value } }) => searchInput(value)}
          />
        </div>
      </div>
      <Table bordered columns={columns} dataSource={data} />
      <Modal
        title="Confirm Modal"
        open={visible.kitapyurdu}
        onOk={handleOkKitapYurdu}
        onCancel={() => {
          setVisible({
            ...visible,
            kitapyurdu: false,
          });
        }}
      >
        <p>Are you sure about doing this process for kitapyurdu? </p>
      </Modal>
      <Modal
        title="Confirm Modal"
        open={visible.kitapsepeti}
        onOk={handleOkKitapSepeti}
        onCancel={() => {
          setVisible({
            ...visible,
            kitapsepeti: false,
          });
        }}
      >
        <p>Are you sure about doing this process for kitapsepeti? </p>
      </Modal>
    </div>
  );
};

export default BooktTable;
