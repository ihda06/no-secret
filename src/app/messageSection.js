import Link from "next/link";
import { Form } from "react-bootstrap";
import { DM_Sans } from "next/font/google";
import { useState } from "react";
import Airtables from "./utils/airtables";
import uniqueID from "./utils/newId";

const font = DM_Sans({
  subsets: ["latin"],
  weight: ["700"],
});

export default function MessageSection({ data, getMessages }) {
  const [newReply, setNewReply] = useState("");

  const handleClick = async () => {
    if (newReply) {
      try {
        await Airtables("replies").create([
          {
            fields: {
              reply_id: uniqueID,
              reply: newReply,
              record_link: [data.data.id],
            },
          },
        ]);
        getMessages()
      } catch (err) {
        if (err) {
          console.error(err);
          return;
        }
      }

      setNewReply("");
    } else {
      console.log("form kosong");
    }
  };

  return (
    <div key={data.data.message_id} className="message-box rounded p-2 mb-2">
      <Link href="/" className={`${font.className} detail-link`}>
        Lihat Detail
      </Link>
      <p className="mb-2 message">{data.data.message}</p>
      <div className="reply-box">
        <Form className="reply-form mt-2 mb-2">
          <div className="w-100 mb-1 text-end">
            <img
              src="/whatsapp-1.svg"
              className="icon-whatsapp"
              alt="icon-whatsapp"
            />
          </div>
          <Form.Control
            value={newReply}
            as="textarea"
            rows={1}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Tulis komen"
          />
        </Form>
        <div className="reply-button" onClick={handleClick}>
          Ajukan
        </div>
      </div>
      {data.children.map((childObj, idx) => (
        <div key={childObj.reply_id} className="reply rounded py-1 px-2 mb-2">
          <span className="message">{childObj.reply}</span>
        </div>
      ))}
    </div>
  );
}
