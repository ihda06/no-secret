import { Button } from "react-bootstrap";

export default function SuccessForm({ setStatus }) {
  const handleClick = () => {
    setStatus(false);
  };
  return (
    <div className="success d-flex flex-column align-items-center py-3 px-2">
      <div className="title1 mb-3">Message Sent</div>
      <img src="/success.svg" alt="success" className="success-image 3" />
      <span className="sub-title2 my-3">
        Do Not tell Ihda Anwari test that you have sent the message
      </span>
      <Button size="lg" className="mb-2 w-100 btn-success2">
        Register Now
      </Button>
      <Button size="lg" className="w-100 btn-success2" onClick={handleClick}>
        Send Another Message
      </Button>
    </div>
  );
}
