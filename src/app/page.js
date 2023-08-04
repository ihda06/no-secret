"use client";
import { createContext, useEffect, useState } from "react";

const Context = createContext();

import "bootstrap/dist/css/bootstrap.min.css";
import "./main.css";

import { Navbar, Button } from "react-bootstrap";
import { IoIosArrowBack } from "react-icons/io";
import styles from "./page.module.css";

import Airtables from "./utils/airtables";
import MessageForm from "./messageForm";
import uniqueID from "./utils/newId";
import SuccessForm from "./successForm";
import merge from "./utils/merge";
import MessageSection from "./messageSection";
import { ipv4 } from "ipify2";
import axios from "axios";
// import Head from "next/head";
// import ipify from "ipify";

export default function Home() {
  const pages = [1, 2, 3, 4, 5];
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState([]);
  const [datas, setDatas] = useState([]);
  const [currentPageData, setCurrentPageData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const fetchData = async (tabel) => {
    try {
      return await Airtables(tabel)
        .select({
          sort: [{ direction: "asc", field: "created_at" }],
        })
        .all();
    } catch (error) {
      console.log(error);
    }
  };
  const getMessages = async () => {
    const data = await fetchData("messages");
    const data2 = await fetchData("replies");

    const transformedData = transformData(data, data2);
    const target = currentPage * 5;
    setCurrentPageData(transformedData.slice(target - 5, target));
    setDatas(transformedData);
    setMessages(data);
    setReplies(data2);
  };

  const sendMessage = async () => {
    if (newMessage) {
      try {
        setLoading(true);
        await Airtables("messages").create([
          {
            fields: {
              message_id: uniqueID,
              message: newMessage,
            },
          },
        ]);
        setLoading(false);
      } catch (err) {
        if (err) {
          console.error(err);
          return;
        }
      }
      setStatus(true);
      setNewMessage("");
      getMessages();
    } else {
      console.log("form kosong");
    }
  };

  const handleClickPage = (page) => {
    const target = 5 * page;
    const newData = datas.slice(target - 5, target);
    // console.log(currentPageData);
    setCurrentPageData(newData);
    setCurrentPage(page);
  };

  const transformData = (rawmessages, rawreplies) => {
    // const newArray =
    const messages = rawmessages.map((item) => {
      return {
        ...item.fields,
        id: item.id,
      };
    });
    const replies = rawreplies.map((item) => {
      return {
        ...item.fields,
        id: item.id,
      };
    });
    return merge(messages, replies);
  };

  const getIP = async () => {
    const IP = await ipv4();
    const location = await axios({
      baseURL: "https://geo.ipify.org/api/v2/country,city",
      method: "get",
      params: { apiKey: "at_9bVVupAKOiri9dHhk0pQXUbY0G1Um", ip: IP },
    });
  };

  useEffect(() => {
    // console.log(status);
    getMessages();
    // getIP();
  }, []);

  return (
    <main className={`${styles.main}`}>
      <title>Share Secret Feedback About Ihda Anwari</title>
      <Navbar className="fixed-top rounded-bottom justify-content-center shadow-sm">
        <div className="back-button">
          <IoIosArrowBack></IoIosArrowBack>
        </div>
        <Navbar.Brand href="#home">
          <img
            src="/bond_small.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="React Bootstrap logo"
          />
          <b>Secreto</b>
        </Navbar.Brand>
      </Navbar>
      <div className="center px-2">
        {!status ? (
          <MessageForm
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            sendMessage={sendMessage}
            status={status}
            loading={loading}
          ></MessageForm>
        ) : (
          <SuccessForm setStatus={setStatus} />
        )}

        <span className="sub-title">
          Beranda <b>Ihda Anwari</b>
        </span>
        <div className="d-flex justify-content-center mt-4">
          <div className="pagination">
            {Array.from({ length: Math.round(datas.length / 5) }, (_, i) => (
              <Button
                key={i}
                size="sm"
                variant="outline-primary"
                className={`m-1 ${
                  currentPage === i + 1 ? "selected-page" : ""
                }`}
                onClick={() => {
                  handleClickPage(i + 1);
                }}
              >
                {i + 1}
              </Button>
            ))}
          </div>
        </div>
        <div className="message-section py-3 rounded">
          {currentPageData.map((obj, idx) => (
            <MessageSection
              key={obj.data.message_id}
              data={obj}
              getMessages={getMessages}
            ></MessageSection>
          ))}
        </div>
      </div>
    </main>
  );
}
