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
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Divider from '@material-ui/core/Divider';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';


// Binding the state and actions. These will be available as props to component
const styles = theme => ({
  rootpage:{
    display:'flex',
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    flexWrap:'wrap',
    flexGrow:1,
    height:'80vh',
  },
  tableDiv:{
    display:'flex',
    flex:1,
    alignItems:'flex-start',
    justifyContent:'center',
    overflow:'auto',
    padding:10,
  },
  cardDiv:{
    display:'flex',
    flex:1,
    alignItems:'flex-start',
    justifyContent:'center',
  },
  root: {
    maxWidth: 550,
    backgroundColor: '#F6F7F9',
    maxHeight: 650,
    overflow: 'auto',
    padding: 10,
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  form:{
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  body:{
    display:'flex',
    flexDirection:'column',
    alignItems:'center',
    justifyContent:'center',
    maxHeight: '600px',
  },
  table: {
    maxHeight: 650,
    overflow: 'scroll',
  },
});

class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newStoreDetails:{
        uuid:"",
        address:"",
        dlNumber:"",
        gstNumber:"",
        isAdmin:false,
        ownerName:"",
        shopName:"",
        contactNumber:"",
      },
      allUsers:{},
    };
  }
  componentWillReceiveProps(nextProps){
    if(this.state.allUsers !== nextProps.coach.allUsers){
      var clearStoreDetails = {
        uuid:"",
        address:"",
        dlNumber:"",
        gstNumber:"",
        isAdmin:false,
        ownerName:"",
        shopName:"",
        contactNumber:"",
      }
      this.setState({
        allUsers:nextProps.coach.allUsers,
        newStoreDetails:clearStoreDetails
      })
    }
  }
  componentWillMount(){
    firebaseutils.read_allusers();
  }
  states = (e, value) => {
    var key = e.target.id;
    var val = e.target.value;
    this.setState(prevState => {
      var newStoreDetails = {...prevState.newStoreDetails};
      newStoreDetails[key] = val;
      return {newStoreDetails};
    })
  }

  submit = () => {
    let payload = {...this.state.newStoreDetails};
    delete payload["uuid"];
    firebaseutils.create_shop(this.state.newStoreDetails.uuid,payload);
  }
  render() {
    //console.log(this.props.coach.allUsers);
    console.log(this.state)
    const { classes } = this.props;
    return (
      <div className={classes.rootpage}>
        <div className={classes.tableDiv}>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Owner Name</TableCell>
                <TableCell align="center">Shop Name</TableCell>
                <TableCell align="center">GST Number</TableCell>
                <TableCell align="center">DL Number</TableCell>
                <TableCell align="center">Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(this.state.allUsers).map((row) => (
                <TableRow key={this.state.allUsers[row].shopName}>
                  <TableCell component="th" scope="row">
                    {this.state.allUsers[row].ownerName}
                  </TableCell>
                  <TableCell align="center">{this.state.allUsers[row].shopName}</TableCell>
                  <TableCell align="center">{this.state.allUsers[row].gstNumber}</TableCell>
                  <TableCell align="center">{this.state.allUsers[row].dlNumber}</TableCell>
                  <TableCell align="center">{this.state.allUsers[row].address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        </div>
        <div className={classes.cardDiv}>
        <Card className={classes.root}>
        <CardHeader
          title="Create New Store"
        />
        <Divider />
        <CardContent className={classes.body}>
          <div className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="uuid"
              label="UUID"
              name="uuid"
              autoComplete="UUID"
              autoFocus
              value={this.state.newStoreDetails.uuid}
              onChange={event => this.states(event)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="address"
              label="ADDRESS"
              name="address"
              autoComplete="Address"
              value={this.state.newStoreDetails.address}
              onChange={event => this.states(event)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="dlNumber"
              label="Drug License Number"
              name="dlNumber"
              autoComplete="Drug License Number"
              value={this.state.newStoreDetails.dlNumber}
              onChange={event => this.states(event)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="gstNumber"
              label="GST Number"
              name="gstNumber"
              autoComplete="GST Number"
              value={this.state.newStoreDetails.gstNumber}
              onChange={event => this.states(event)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="ownerName"
              label="Owner Name"
              name="ownerName"
              autoComplete="Owner Name"
              value={this.state.newStoreDetails.ownerName}
              onChange={event => this.states(event)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="contactNumber"
              label="Contact Number"
              name="contactNumber"
              autoComplete="Contact Number"
              value={this.state.newStoreDetails.contactNumber}
              onChange={event => this.states(event)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="shopName"
              label="Shop Name"
              name="shopName"
              autoComplete="Shop Name"
              value={this.state.newStoreDetails.shopName}
              onChange={event => this.states(event)}
            />
          </div>
        </CardContent>
        <CardActions disableSpacing>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => this.submit()}
          >
            Submit
          </Button>
        </CardActions>
        </Card>
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Admin));
