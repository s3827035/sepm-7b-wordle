import Tile from "./Tile";

function Row(props) {

    const tiles = 5;

    return (
        <div className="game-row">

            {/* Loop from 0 to 5 and draw each tile */}

            {new Array(tiles).fill(0).map((_, index) => (
                <Tile key={index} value={props.values[index]} outcome={props.matrix[index]}/>
            ))}

        </div>
    );

}

export default Row;