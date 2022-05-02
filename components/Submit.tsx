import { useState, ReactElement } from "react";

const displayThankYou = (
  setThanks: Function,
  setSubmitting: Function
): void => {
  setThanks(true);
  setTimeout(() => {
    setSubmitting(false);
    setThanks(false);
  }, 5000);
};

const Submit = ({
  submitQuestion,
  setSubmitting,
}: {
  submitQuestion: Function;
  setSubmitting: Function;
}): ReactElement => {
  const [email, setEmail] = useState<string>("");
  const [thanks, setThanks] = useState<boolean>(false);

  return thanks ? (
    <div className="submit content-panel">thank you for submitting!</div>
  ) : (
    <div className="submit content-panel">
      <p>new questions submission:</p>
      <br/>
      <p>
        before you submit a new question, take a look at the suggested posts
        below to make sure the info is not already here!
      </p>
      <br/>
      <p>
        if you want to, you can also submit your email - it will let me notify
        you when your question is answered, as well as put you on my mailing list (i
        promise not to spam you!)
      </p>
      <input
        className="email-submit"
        contentEditable={true}
        placeholder={"email"}
        value={email}
        type={"email"}
        onChange={(e) => setEmail(e.target.value)}
      ></input>
      <br/>
      <button
        className="submit-button"
        onClick={() => {
          submitQuestion(email);
          displayThankYou(setThanks, setSubmitting);
        }}
      >
        submit!
      </button>
      <button className="cancel-button" onClick={() => setSubmitting(false)}>
        cancel!
      </button>

    </div>
  );
};

export default Submit;
