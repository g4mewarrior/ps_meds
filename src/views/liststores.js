import React, { Component } from "react";
import { connect } from "react-redux";
import { Actions } from "jumpstate";
import { browserHistory } from "react-router";
import * as firebaseutils from "../utils/firebaseutils";
import firebase from "firebase";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Dropdown from '../components/Dropdown';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Bill from '../components/Bill';
import QRCode from "qrcode.react";
import { v4 as uuidv4 } from 'uuid';
// Binding the state and actions. These will be available as props to component

const styles = theme => ({
  button: {
    margin: theme.spacing(1),
  },
  hidden: {
    display: 'none'
  },
  rootpage:{
    display:'flex',
    flexDirection:'column',
    width:'100%',
    height:'84vh',
    backgroundColor:'white',
    color:'black',
  },
  infoSection:{
    display:'flex',
    flexDirection:'column',
    flex:'2',
  },
  infoHeader:{
    display:'flex',
    flex:'1',
    justifyContent:'center',
    fontSize:30,
    backgroundColor:'#343a40',
    color:'white',
    padding:10,
  },
  infoBody:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap:'wrap',
    padding:5,
    flex:'3',
  },
  infoFooter:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    flexWrap:'wrap',
    flex:'3',
  },
  billingSection:{
    flex:'8',
    maxWidth:'96vw',
    maxHeight:'80vh',
    overflow:'auto',
  },
  submitSection:{
    flex:'1',
    display:'flex',
    backgroundColor:'#343a40',
    alignItems:'center',
    justifyContent:'flex-end',

  },
  header: {
    flex:'1',
    color:'white',
    fontSize:'24px',
  },
  body:{
    flex:'15',
  },
  footerNotice: {
    flex:'1',
    color:'white',
    textAlign:'center',
    fontSize:'24px',
  },
  tableItem:{
    verticalAlign:"center",
  },
  fab: {
    margin: theme.spacing(2),
  },
  AutoComplete:{
    width:'300px',
  },
  billSection:{
    marginTop:theme.spacing(2),
    display:'flex',
    flexDirection:'column',
    width:'100%',
    justifyContent:'space-between',
  },
  topPurchase:{
    maxWidth:'80vw',
    height:'80vh',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap:'wrap',
  },
  purchaseTopDiv:{
    width:'100%',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    flexWrap:'wrap',
  },
  eachTextfield:{
    width:'90px',
  },
  options:{
    backgroundColor:'green',
  },
  footer:{
    width:'100%',
    height:'50px',
    textAlign:'center',
  },
  seller:{
    width:'300px',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    textAlign:'center',
    flex: 1,
  },
  pdfViewer:{
    display:'flex',
    width:'100%',
    height:'90vh',
  }
});

function Copyright() {
  return (
    <Typography variant="body2" color="white" align="center">
      {'Copyright © '}
      <Link color="inherit" >
        Prem Shree Medicines
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

class Liststores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      key:0,
      invoice_number:0,
      allUsers:[],
      searchData:[],
      finalBill:{},
      compressedString:"",
      billModal:false,
      img_src:"",
      selectedUser:{},
      seller:"Default Seller",
      seller_gstin:"123213123131",
      seller_dlnumber:"3/3A",
      seller_contact:"9835010393",
      billForm:[
        {
          "id":0,
          "Product":"",
          "Pack":"",
          "MFG":"",
          "Batch":"",
          "Expiry":"",
          "Quantity":0,
          "Free":0,
          "MRP":0,
          "Rate":0,
          "Disc(%)":0,
          "Taxable":0,
          "CGST(%)":0,
          "SGST(%)":0,
          "IGST(%)":0,
          "CGSTVAL":0,
          "SGSTVAL":0,
          "IGSTVAL":0,
        }
      ],
    };
  }
  componentWillReceiveProps(nextProps){
    var allUsers = nextProps.coach.allUsers;
    var allUsersarray = [];
    Object.keys(allUsers).map((key)=>{
      var newObj=allUsers[key];
      newObj['uuid']=key;
      allUsersarray.push(allUsers[key]);
    });
    //console.log('allUsersarray',allUsersarray);
    //console.log('searchresultarray',nextProps.coach.searchData);
    var date = new Date();
    var invoice_number = uuidv4();
    this.setState({allUsers:allUsersarray,invoice_number:invoice_number});
  }
  componentWillMount(){
    firebaseutils.read_allusers();
    firebaseutils.search_meds("a");
  }

  selectedStore = (newValue) => {
    this.setState({
      selectedUser:newValue
    })
  }

  deleteRow = (index) => {
    var billForm = this.state.billForm;
    //console.log(index);
    billForm.splice(index,1);
    this.setState({billForm:billForm});
    console.log(this.state.billForm);
  }

  states = (event,index) => {
    var key = event.target.name;
    var val = event.target.value;
    var billForm = this.state.billForm;
    billForm[index][key] = val;
    if(key === 'Disc(%)'){
      billForm[index]['Taxable'] = billForm[index]['Rate'] *  billForm[index]['Quantity'] * (100-val)/100;
    }
    if(key === 'CGST(%)'){
      billForm[index]['CGSTVAL'] = billForm[index]['Taxable'] * (val)/100;
    }
    if(key === 'SGST(%)'){
      billForm[index]['SGSTVAL'] = billForm[index]['Taxable'] * (val)/100;
    }
    if(key === 'IGST(%)'){
      billForm[index]['IGSTVAL'] = billForm[index]['Taxable'] * (val)/100;
    }
    var total_taxable=0,tax=0;
    var tax_slab={
      "CGST":{},
      "SGST":{},
      "IGST":{},
    };
    for (var i = 0; i < billForm.length; i++) {
      tax_slab["CGST"][billForm[i]["CGST(%)"]]=tax_slab["CGST"][billForm[i]["CGST(%)"]] || {};
      tax_slab["SGST"][billForm[i]["SGST(%)"]]=tax_slab["SGST"][billForm[i]["SGST(%)"]] || {};
      tax_slab["IGST"][billForm[i]["IGST(%)"]]=tax_slab["IGST"][billForm[i]["IGST(%)"]] || {};
      tax_slab["CGST"][billForm[i]["CGST(%)"]]['Taxable'] = tax_slab["CGST"][billForm[i]["CGST(%)"]]['Taxable']+billForm[i]['Taxable'] || billForm[i]['Taxable'];
      tax_slab["SGST"][billForm[i]["SGST(%)"]]['Taxable'] = tax_slab["SGST"][billForm[i]["SGST(%)"]]['Taxable']+billForm[i]['Taxable'] || billForm[i]['Taxable'];
      tax_slab["IGST"][billForm[i]["IGST(%)"]]['Taxable'] = tax_slab["IGST"][billForm[i]["IGST(%)"]]['Taxable']+billForm[i]['Taxable'] || billForm[i]['Taxable'];
      tax_slab["CGST"][billForm[i]["CGST(%)"]]['Tax'] = tax_slab["CGST"][billForm[i]["CGST(%)"]]['Tax']+billForm[i]['CGSTVAL'] || billForm[i]['CGSTVAL'];
      tax_slab["SGST"][billForm[i]["SGST(%)"]]['Tax'] = tax_slab["SGST"][billForm[i]["SGST(%)"]]['Tax']+billForm[i]['SGSTVAL'] || billForm[i]['SGSTVAL'];
      tax_slab["IGST"][billForm[i]["IGST(%)"]]['Tax'] = tax_slab["IGST"][billForm[i]["IGST(%)"]]['Tax']+billForm[i]['IGSTVAL'] || billForm[i]['IGSTVAL'];
      total_taxable+=billForm[i]['Taxable'];
      tax+=billForm[i]['CGSTVAL']+billForm[i]['SGSTVAL']+billForm[i]['IGSTVAL'];
    }
    var total = total_taxable+tax;
    var date = new Date();
    var invoice_date = date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
    var customer = this.state.selectedUser;
    var bill = {
      invoice_number:this.state.invoice_number,
      invoice_date:invoice_date,
      seller_store:{
        store_name:this.state.seller,
        store_address:"N/A",
        store_gstin:this.state.seller_gstin,
        store_contact:this.state.seller_contact,
        store_dlnumber:this.state.seller_dlnumber,
      },
      customer_store:{
        store_name:customer.shopName,
        store_address:customer.address,
        store_gstin:customer.gstNumber,
        store_contact:customer.contactNumber,
        store_dlnumber:customer.dlNumber,
      },
      items:billForm,
      total_taxable:total_taxable,
      tax:tax,
      tax_slab:tax_slab,
      total:total,
    };
    console.log(billForm,bill);
    var jsscompress = require("js-string-compression");
    var hm = new jsscompress.Hauffman();
    var compressed = hm.compress(JSON.stringify(bill));
    console.log("before length: " + JSON.stringify(bill).length);
    console.log("length: " + compressed.length);
    this.setState({billForm:billForm,finalBill:bill,compressedString:compressed});
  }

  createBill = () => {
    const canvas = document.getElementById('qr');
    var pngUrl = canvas.toDataURL("image/png");
    this.setState({billModal:true,img_src:pngUrl});
  }

  addRow = () => {
    var payload = {
      "id":this.state.billForm[this.state.billForm.length - 1]["id"]+1,
      "Product":"",
      "Pack":"",
      "MFG":"",
      "Batch":"",
      "Expiry":"",
      "Quantity":0,
      "Free":0,
      "MRP":0,
      "Rate":0,
      "Disc(%)":0,
      "Taxable":0,
      "CGST(%)":0,
      "SGST(%)":0,
      "IGST(%)":0,
      "CGSTVAL":0,
      "SGSTVAL":0,
      "IGSTVAL":0,
    };
    var billForm = this.state.billForm;
    billForm.push(payload);
    console.log('add row',billForm);
    this.setState({billForm:billForm});
  }

  renderOptions = (index) =>{
    const { classes } = this.props;
    if(index===this.state.billForm.length-1){
      return(
        <Fab size="small" color="primary" aria-label="Add" className={classes.fab}>
          <AddIcon onClick={this.addRow} />
        </Fab>
      )
    }
    return(
      <Fab size="small" color="primary" aria-label="Delete" className={classes.fab}>
        <DeleteIcon onClick={() => this.deleteRow(index)} />
      </Fab>
    )
  }

  setValue = (index,payload) => {
    var billForm = this.state.billForm;
    console.log(payload);
    var newpayload = {
      "id":this.state.billForm[index]["id"],
      "Product":payload["display_name"],
      "Pack":payload["pack_size"],
      "MFG":payload["manufacturer_name"],
      "Batch":"",
      "Expiry":"",
      "Quantity":0,
      "Free":0,
      "MRP":payload["selling_price"],
      "Rate":0,
      "Disc(%)":0,
      "Taxable":0,
      "CGST(%)":0,
      "SGST(%)":0,
      "IGST(%)":0,
      "CGSTVAL":0,
      "SGSTVAL":0,
      "IGSTVAL":0,
    };
    billForm[index]=newpayload;
    console.log(newpayload);
    this.setState({billForm:billForm});
  }

  setModalClose = () => {
    this.setState({billModal:false});
  }

  render() {
    console.log(JSON.stringify(this.state.finalBill));
    const { classes } = this.props;
    return (
      <div className={classes.rootpage}>
      <div className={classes.hidden}>
        <QRCode
          id="qr"
          value={JSON.stringify(this.state.finalBill)}
          level={"L"}
          size={500}
        />
      </div>
      <Dialog fullScreen open={this.state.billModal} onClose={this.setModalClose}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={this.setModalClose} aria-label="Close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              INVOICE
            </Typography>
            <Button color="inherit" onClick={this.setModalClose}>
              Save Bill
            </Button>
          </Toolbar>
        </AppBar>
        <div className={classes.pdfViewer}>
          <Bill data={this.state.finalBill} qr={this.state.img_src} />
        </div>
      </Dialog>
        <div className={classes.infoSection}>
            <div className={classes.infoHeader}>
                Purchase Section
            </div>
            <Divider />
            <div className={classes.infoFooter}>
                <TextField
                  id="seller"
                  label="Seller"
                  className={classes.seller}
                  value={this.state.seller}
                  onChange={(event)=>this.setState({seller:event.target.value})}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="seller_gstin"
                  label="GSTIN"
                  className={classes.seller}
                  value={this.state.seller_gstin}
                  onChange={(event)=>this.setState({seller_gstin:event.target.value})}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="seller_dlnumber"
                  label="DL"
                  className={classes.seller}
                  value={this.state.seller_dlnumber}
                  onChange={(event)=>this.setState({seller_dlnumber:event.target.value})}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="seller_contact"
                  label="Contact"
                  className={classes.seller}
                  value={this.state.seller_contact}
                  onChange={(event)=>this.setState({seller_contact:event.target.value})}
                  margin="normal"
                  variant="outlined"
                />
            </div>
            <Divider />
            <div className={classes.infoBody}>
                <Autocomplete
                  id="search-store"
                  disableClearable
                  onChange={(event, newValue) => this.selectedStore(newValue)}
                  options={this.state.allUsers}
                  getOptionLabel={(option) => option.shopName}
                  className={classes.seller}
                  renderInput={(params) => <TextField {...params} label="Customer" variant="outlined" />}
                />
                <TextField
                  id="buyer_gstNumber"
                  label="GSTIN"
                  className={classes.seller}
                  value={this.state.selectedUser.gstNumber}
                  defaultValue="N/A"
                  onChange={(event)=>{
                    const { value } = event.target;
                    this.setState(prevState =>{
                      var selectedUser = {...prevState.selectedUser};
                      selectedUser['gstNumber'] = value;
                      return {selectedUser};
                    })
                  }}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="buyer_dlNumber"
                  label="DL Number"
                  className={classes.seller}
                  value={this.state.selectedUser.dlNumber}
                  defaultValue="N/A"
                  onChange={(event)=>{
                    const { value } = event.target;
                    this.setState(prevState =>{
                      var selectedUser = {...prevState.selectedUser};
                      selectedUser['dlNumber'] = value;
                      return {selectedUser};
                    })
                  }}
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  id="buyer_contact"
                  label="Contact"
                  className={classes.seller}
                  value={this.state.selectedUser.contactNumber}
                  defaultValue="N/A"
                  onChange={(event)=>{
                    const { value } = event.target;
                    this.setState(prevState =>{
                      var selectedUser = {...prevState.selectedUser};
                      selectedUser['contactNumber'] = value;
                      return {selectedUser};
                    })
                  }}
                  margin="normal"
                  variant="outlined"
                />
            </div>
            <Divider />
        </div>
        <div className={classes.billingSection}>
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product</th>
              <th scope="col">Pack</th>
              <th scope="col">MFG</th>
              <th scope="col">Batch</th>
              <th scope="col">Expiry</th>
              <th scope="col">Quantity</th>
              <th scope="col">Free</th>
              <th scope="col">MRP</th>
              <th scope="col">Rate</th>
              <th scope="col">Disc(%)</th>
              <th scope="col">Taxable</th>
              <th scope="col">CGST(%)</th>
              <th scope="col">SGST(%)</th>
              <th scope="col">IGST(%)</th>
              <th scope="col">Option</th>
            </tr>
          </thead>
          <tbody >
            {this.state.billForm.map((row,index)=>(
              <tr key={row["id"]}>
                <th scope="row" className={classes.tableItem}>{index+1}</th>
                <td className={classes.tableItem}>
                  <div className={classes.AutoComplete} >
                    <Dropdown id={index} key={index} onClick={this.setValue} onChange={firebaseutils.search_meds} options={this.props.coach.searchData} optionsLabel="display_name" label="Search Medicine" value={row['Product']} />
                  </div>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Pack" name="Pack" value={this.state.billForm[index]['Pack']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField fullWidth className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Manufacturer" name="MFG" value={this.state.billForm[index]['MFG']} />
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Batch" name="Batch" onChange={(event)=>this.states(event,index)} value={this.state.billForm[index]['Batch']} />
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Expiry" name="Expiry" value={this.state.billForm[index]['Expiry']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="QTY" name="Quantity" value={this.state.billForm[index]['Quantity']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Free" name="Free" value={this.state.billForm[index]['Free']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="MRP" name="MRP" value={this.state.billForm[index]['MRP']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Rate" name="Rate" value={this.state.billForm[index]['Rate']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Disc" name="Disc(%)" value={this.state.billForm[index]['Disc(%)']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="Taxable" name="Taxable" value={this.state.billForm[index]['Taxable']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="CGST" name="CGST(%)" value={this.state.billForm[index]['CGST(%)']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="SGST" name="SGST(%)" value={this.state.billForm[index]['SGST(%)']}/>
                </td>
                <td className={classes.tableItem}>
                  <TextField className={classes.eachTextfield} onChange={(event)=>this.states(event,index)} label="IGST" name="IGST(%)" value={this.state.billForm[index]['IGST(%)']}/>
                </td>
                <td className={classes.tableItem}>
                  {this.renderOptions(index)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div className={classes.submitSection}>
          <Button onClick={this.createBill} variant="contained" color="primary" className={classes.button}>
            Create Bill
          </Button>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    coach: state.coach
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Liststores));
