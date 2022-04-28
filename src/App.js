import "./static/app.css";
import Row from "./components/Row";

function App() {

    const rows = 6;

    return (
        <div className="App">

            <div className="rows">

                {new Array(rows).fill(0).map((_, index) => (
                    <Row key={index}/>
                ))}

            </div>

        </div>
    );

}

export default App;
