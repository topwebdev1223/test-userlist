import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';
import {
  Grid,
  Paper,
  Table,
  Button,
  Dialog,
  Select,
  MenuItem,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Typography,
  TextField,
  DialogTitle,
  DialogContent,
  DialogActions,
  TableContainer,
  CircularProgress,
} from '@material-ui/core';
import {
  Search as SearchIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
} from '@material-ui/icons';
import IconButton from '@material-ui/core/IconButton';

const useStyles = makeStyles({
  employeeRow: {
    cursor: 'pointer'
  },
  filtersContainer: {
    padding: '20px 0',
  },
  tableRoot: {
    position: 'relative',
  },
  progressContainer: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(128, 128, 128, 0.3)'
  },
  titleContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  loadingEmployeeDetailsContainer: {
    minWidth: 200,
    minHeight: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function SimpleTable() {
  const classes = useStyles();

  const [filter, setFilter] = useState({
    limit: 25,
    lastName: '',
    firstName: '',
  });

  const [staticFilter, setStaticFilter] = useState({
    limit: 25,
    lastName: '',
    firstName: '',
  });

  const [userDetails, setUserDetails] = useState({});
  const [limits] = useState([25, 50, 100, 200]);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [userDetailsModalOpen, setUserDetailsModalOpen] = useState(false);
  const [loadingEmployeeDetails, setLoadingEmployeeDetails] = useState(true);

  const [columns] = useState([
    { title: 'Last Name', key: 'lastName' },
    { title: 'First Name', key: 'firstName' },
    { title: 'Username', key: 'userPrincipalName' },
    { title: 'Office Number', key: 'officePhone' },
    { title: 'Mobile Number', key: 'mobilePhone' }
  ]);
  const [userDetailsRows] = useState([
    { title: 'Last Name', key: 'lastName' },
    { title: 'First Name', key: 'firstName' },
    { title: 'Username', key: 'userPrincipalName' },
    { title: 'Job Title', key: 'jobTitle' },
    { title: 'Department', key: 'department' },
    { title: 'Office Number', key: 'officePhone' },
    { title: 'Mobile Number', key: 'mobilePhone' }
  ]);

  const onClickEmployee = (employee, employeeIndex) => {
    setUserDetailsModalOpen(true);
    setLoadingEmployeeDetails(true);
    axios.get(`/employees/${employee.id}`)
      .then(({ data }) => {
        setUserDetails(data);
      })
      .finally(() => {
        setLoadingEmployeeDetails(false);
      });
  }

  const handleCloseUserDetailsModal = () => {
    setUserDetailsModalOpen(false);
  }

  const handleChangeLimit = (e, { props }) => {
    setFilter({
      ...filter,
      limit: props.value
    });
  }

  const handleChangeStaticFilterKey = (e, key) => {
    setStaticFilter({
      ...staticFilter,
      [key]: e.target.value
    });
  }

  const onClickSearchIcon = () => {
    setFilter({
      ...staticFilter
    });
  }

  useEffect(() => {
    let fetchEmployees = () => {
      setLoading(true);
      axios.get('/employees', {
          params: filter
        })
        .then(({ data }) => {
          setEmployees(Array.isArray(data) ? data : []);
        })
        .finally(() => {
          setLoading(false);
        });
    }

    fetchEmployees();
  }, [filter]);

  return (
    <Grid container alignItems="center" justify="center">
      <Grid item container xs={12} md={10} style={{ padding: 15 }}>
        <Grid item xs={12} style={{ padding: 30 }} component={Paper}>
          <Typography variant="h4">
            <PeopleAltIcon /> User List
          </Typography>
          <Grid className={classes.filtersContainer} container>
            <Grid item container md={11} spacing={4}>
              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
                  value={filter.limit}
                  onChange={handleChangeLimit}
                >
                  {limits.map((limit, limitIndex) => (
                    <MenuItem value={limit} key={limitIndex}>{limit}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Last Name"
                  value={staticFilter.lastName}
                  onChange={(e) => handleChangeStaticFilterKey(e, 'lastName')}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="First Name"
                  value={staticFilter.firstName}
                  onChange={(e) => handleChangeStaticFilterKey(e, 'firstName')}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} md={1}>
              <IconButton
                style={{
                  float: 'right'
                }}
                onClick={onClickSearchIcon}
              >
                <SearchIcon />
              </IconButton>
            </Grid>
          </Grid>

          <Dialog
            fullWidth
            PaperProps={{
              style: {
                margin: 0,
                width: '100%'
              }
            }}
            open={userDetailsModalOpen}
            onClose={handleCloseUserDetailsModal}>
            <DialogTitle className={classes.titleContainer}>
              <PersonIcon /> Users Details
            </DialogTitle>
            <DialogContent>
              {loadingEmployeeDetails ? (
                <div className={classes.loadingEmployeeDetailsContainer}>
                  <CircularProgress size={25} />
                </div>
              ) : (
                <Table>
                  <TableBody>
                    {userDetailsRows.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell component="th">{row.title}</TableCell>
                        <TableCell>{userDetails[row.key]}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseUserDetailsModal} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>

          <TableContainer className={classes.tableRoot}>
            {loading && (
              <div className={classes.progressContainer}>
                <CircularProgress size={25} />
              </div>
            )}
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map(({ title }, columnIndex) => (
                    <TableCell style={{ whiteSpace: 'nowrap' }} key={columnIndex}>{title}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((employee, employeeIndex) => (
                  <TableRow
                    key={employeeIndex}
                    className={classes.employeeRow}
                    onClick={() => onClickEmployee(employee, employeeIndex)}>
                    {columns.map(({ key }, columnIndex) => (
                      <TableCell key={columnIndex}>{employee[key]}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Grid>
  );
}
