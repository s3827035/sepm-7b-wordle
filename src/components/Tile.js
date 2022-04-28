function Tile(props) {

    return (
        <div className={"tile" + (props.value !== "" ? ' filled' : '')}>
            {props.value}
        </div>
    );

}

export default Tile;
