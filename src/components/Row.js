import Tile from "./Tile";

function Row(props) {

    const tiles = 5;

    return (
        <div className="row">

            {new Array(tiles).fill(0).map((_, index) => (
                <Tile key={index} value={"A"}/>
            ))}

        </div>
    );

}

export default Row;