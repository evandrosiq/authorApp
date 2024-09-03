

export const customStyles = {
    control: (provided: any) => ({
        ...provided,
        border: '1px solid #f08080',
        borderRadius: '10px',
        paddingRight: '20px',
        paddingLeft: '15px',
        marginRight: '33px',
        marginLeft: '21px',
    }),
    menu: (provided: any) => ({
        ...provided,
        width: '100%',
        backgroundColor: 'white',
        marginRight: 0,
        marginLeft: 0,
        marginTop: '16px',
        borderRadius: 0,
        borderBottom: 'none',
        boxShadow: 'none',
    }),
    menuList: (provided: any) => ({
        ...provided,
        width: '100%',
        maxHeight: '590px',
        overflowY: 'auto',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'white' : 'white',
        color: state.isSelected ? '#707070' : '#f08080',
        fontFamily: 'Source Sans Pro, sans-serif',
        fontSize: '18px',
        fontWeight: '700',
        lineHeight: '32px',
        paddingLeft: '25px',
        '&:hover': {
            backgroundColor: 'white',
            color: '#707070',
        },
    }),
    valueContainer: (provided: any) => ({
        ...provided,
        fontFamily: 'Source Sans Pro, sans-serif',
        fontSize: '18px',
        fontWeight: '700',
        lineHeight: '32px',
        color: '#333333'
    }),
    indicatorSeparator: (provided: any) => ({
        ...provided,
        display: 'none',
    }),
    indicatorsContainer: (provided: any) => ({
        ...provided,
        "& > div": {
            background: 'transparent', 
            width: 0,
        },
        background: `url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iMTZweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cGF0aCBkPSJNNS43MDcxMSA5LjcxMDY5QzUuMzE2NTggMTAuMTAxMiA1LjMxNjU4IDEwLjczNDQgNS43MDcxMSAxMS4xMjQ5TDEwLjU5OTMgMTYuMDEyM0MxMS4zODA1IDE2Ljc5MjcgMTIuNjQ2MyAxNi43OTI0IDEzLjQyNzEgMTYuMDExN0wxOC4zMTc0IDExLjEyMTNDMTguNzA4IDEwLjczMDggMTguNzA4IDEwLjA5NzYgMTguMzE3NCA5LjcwNzA4QzE3LjkyNjkgOS4zMTY1NSAxNy4yOTM3IDkuMzE2NTUgMTYuOTAzMiA5LjcwNzA4TDEyLjcxNzYgMTMuODkyN0MxMi4zMjcxIDE0LjI4MzMgMTEuNjkzOSAxNC4yODMyIDExLjMwMzQgMTMuODkyN0w3LjEyMTMyIDkuNzEwNjlDNi43MzA4IDkuMzIwMTYgNi4wOTc2MyA5LjMyMDE2IDUuNzA3MTEgOS43MTA2OVoiIGZpbGw9IiNmMDgwODAiLz4NCjwvc3ZnPg==") no-repeat right center`,
        backgroundSize: '15px', 
        width: '20px', 
        height: '36px', 

    }),
};
