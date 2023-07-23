import React, { useMemo, useEffect, useState, useCallback } from "react";
import { Space, Table, Tag, Input, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import "./BookTabLe.scss"
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

const BooktTable = () => {
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

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/all")
      .then((val) => val.json())
      .then((res) => {
        setData(res);
        setTempData(res);
      });
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
        <div style={{display:"flex",alignItems:"center"}} >
          <div>
            <Button type="primary" style={{marginRight:"20px"}} >KitapYurdu Update</Button>
            <Button className="kitap_sepeti">KitapSepeti Update</Button>
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
    </div>
  );
};

export default BooktTable;
