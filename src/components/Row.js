import Tile from "./Tile";

function Row(props) {

    const tiles = 5;

    return (
        <div className="game-row">

            {new Array(tiles).fill(0).map((_, index) => (
                <Tile key={index} value={props.values[index]}/>
            ))}

        </div>
    );

}

export default Row;