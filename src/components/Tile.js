function Tile(props) {

    return (

        // Set the value and its className based on the fact whether the tile is filled or not

        <div id={"tile-" + props.rowId + "-" + props.tileId} className={"tile" + (props.value !== "" ? ' filled' : '') + (props.outcome !== "" ? ' vl-' + props.outcome.toLowerCase() : '')}>
            {props.value}
        </div>

    );

}

export default Tile;
