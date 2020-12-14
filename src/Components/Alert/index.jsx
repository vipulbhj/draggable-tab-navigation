import "./style.css";

export default function Alert(props) {
  return (
    <main className="Alert">
      <section className="MessageBox">
        <p>You deleted {props.message}</p>
        <button onClick={props.onClose}>Close</button>
      </section>
    </main>
  );
}
