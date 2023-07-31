import { Button, Form } from "react-bootstrap";
import Loader from "./loader";

export default function MessageForm({
  newMessage,
  setNewMessage,
  sendMessage,
  loading,
}) {
  if (!loading) {
    return (
      <div className="form p-3 my-3 rounded">
        <div className="text-center mb-3">
          <div className="title1">KIRIM PESAN TIDAK DIKENAL KEPADA</div>
          <b className="title2">Ihda Anwari</b>
        </div>
        <ul>
          <li>Ihda Anwari tidak akan pernah tahu yang mengirim pesan ini</li>
        </ul>

        <Form className="pb-4 my-2">
          <Form.Control
            as="textarea"
            rows={4}
            placeholder="Tulis pesan rahasia"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
        </Form>
        <Button className="submit" onClick={sendMessage}>
          Ajukan
        </Button>
      </div>
    );
  } else
    return (
      <>
        <Loader></Loader>
      </>
    );
}
