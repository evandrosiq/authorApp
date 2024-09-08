
export const customStyles = {
    control: (provided: any, state:any) => ({
        ...provided,
        border: '1px solid #f08080',
        borderRadius: '10px',
        width: 180,        
        boxShadow: state.isFocused ? '0 0 0 1px #ff7f50' : 'none', 
        borderColor: state.isFocused ? '#ff7f50' : provided.borderColor, 
        '&:hover': {
          borderColor: state.isFocused ? '#ff7f50' : provided.borderColor
        }
    }),
    menu: (provided: any) => ({
        ...provided,
        width: 180,
        backgroundColor: 'white',
        marginRight: 0,
        marginLeft: 0,
        marginTop: '6px',
        borderRadius: 0,
        borderBottom: 'none',
        boxShadow: 'none',
    }),
    menuList: (provided: any) => ({
        ...provided,
        width: 180,
        maxHeight: '590px',
        overflowY: 'auto',
    }),
    option: (provided: any, state: any) => ({
        ...provided,
        width: 180,
        backgroundColor: state.isSelected ? 'white' : 'white',
        color: state.isSelected ? '#707070' : '#f08080',
        fontFamily: 'Source Sans Pro, sans-serif',
        fontSize: '16px',
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
        fontSize: '16px',
        fontWeight: '600',
        lineHeight: '30px',
        color: '#707070'
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
        background: `url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPg0KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4NCjxwYXRoIGQ9Ik01LjcwNzExIDkuNzEwNjlDNS4zMTY1OCAxMC4xMDEyIDUuMzE2NTggMTAuNzM0NCA1LjcwNzExIDExLjEyNDlMMTAuNTk5MyAxNi4wMTIzQzExLjM4MDUgMTYuNzkyNyAxMi42NDYzIDE2Ljc5MjQgMTMuNDI3MSAxNi4wMTE3TDE4LjMxNzQgMTEuMTIxM0MxOC43MDggMTAuNzMwOCAxOC43MDggMTAuMDk3NiAxOC4zMTc0IDkuNzA3MDhDMTcuOTI2OSA5LjMxNjU1IDE3LjI5MzcgOS4zMTY1NSAxNi45MDMyIDkuNzA3MDhMMTIuNzE3NiAxMy44OTI3QzEyLjMyNzEgMTQuMjgzMyAxMS42OTM5IDE0LjI4MzIgMTEuMzAzNCAxMy44OTI3TDcuMTIxMzIgOS43MTA2OUM2LjczMDggOS4zMjAxNiA2LjA5NzYzIDkuMzIwMTYgNS43MDcxMSA5LjcxMDY5WiIgZmlsbD0iI2YwODA4MCIvPg0KPC9zdmc+") no-repeat right center`,
        backgroundSize: '29px', 
        width: '25px', 
        height: '36px',

    }),
    singleValue: (provided: any) => ({
        ...provided,
        color: '#707070',
    }),
};
