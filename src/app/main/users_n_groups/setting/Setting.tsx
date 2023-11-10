import { FusePageCarded } from "@fuse";
import HeaderComponent from "app/components/HeaderComponent";
import { MyMaterialTable } from "app/components/MyMaterialTable";
import Axios from "axios";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Setting: React.FC = () => {
  const { t } = useTranslation();

  const [data, setData] = React.useState<any[]>([]);

  const href = window.location.pathname.split("/");
  const title = t(href[1]);
  const title2 = t(href[2]);

  const getData = async () => {
    const res = await Axios.get("v1/setting");
    setData(res.data);
  };

  useEffect(() => {
    document.title = `${process.env.REACT_APP_WEBSITE_NAME} | ${title}`;
  }, []);

  useEffect(() => {
    void getData();
  }, []);

  return (
    <FusePageCarded
      header={<HeaderComponent breadcrumbs={[title]} titlePage={title} />}
      contentToolbar={
        <div className="px-24">
          <h2>{title2}</h2>
        </div>
      }
      content={
        <div className="m-16">
          <MyMaterialTable
            columns={[
              {
                label: "ID",
                field: "locationId",
              },
            ]}
            data={data}
          />
        </div>
      }
    />
  );
};
