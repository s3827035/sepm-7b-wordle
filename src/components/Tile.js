function Tile(props) {

    return (

        // Set the value and its className based on the fact whether the tile is filled or not

        <div className={"tile" + (props.value !== "" ? ' filled' : '')}>
            {props.value}
        </div>

    );

}

export default Tile;
