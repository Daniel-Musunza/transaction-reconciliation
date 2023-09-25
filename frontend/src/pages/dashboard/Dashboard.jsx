import { faFile, faHeart, faHome, faMoneyBillAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { reset } from '../../features/auth/authSlice';
import { gettransactions } from "../../features/transactions/transactionSlice";


function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //redux stuff
    const { user } = useSelector((state) => state.auth);
    const { transactions, isError, message } = useSelector((state) => state.transactions);
    
    useEffect(() => {
        if (isError) {
          console.log(message);
        }
    
        if (!user) {
          navigate('/');
          return;
        }
        dispatch(gettransactions());
    
        return () => {
          dispatch(reset());
        };
      }, [user, navigate, isError, message, dispatch]);

      const filteredTransactions = transactions.filter(
        (transaction) =>
          transaction.branch === user.branch
      );


    const[SelectedOption, setSelectedOption] = useState('Today');

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    }
    const[SearchInput, setSearchInput] = useState('');

    const handleSearchInput = (e) => {
        setSearchInput(e.target.value);
    }

    const handleDownLoadTable = () => {
        const table = document.querySelector('.client-transaction-table table');
        const doc = new jsPDF();
        doc.autoTable({html: table});
        doc.save('transaction-table.pdf');
    }
    return (
        <div className="dashboard">
            <div className="dash-page">
                <div className="sidebar">
                    <div className="sidebar-log">
                        <h3>Insure Now</h3>
                    </div>
                    <div className="sidebar-links">
                        <ul>
                            <li>
                                <Link to="/home">
                                    <FontAwesomeIcon icon={faHome}/>
                                   <p>Home</p> 
                                </Link>
                            </li>
                            <li>
                                <Link to="/home">
                                    <FontAwesomeIcon icon={faHeart}/>
                                    <p>Health</p>
                                    
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="dash-content">
                    <div className="dash-header">
                        <div className="dash-log">
                            <h2>Dashboard</h2>
                        </div>
                        <div className="header-detail">
                            <div className="search">
                                <input 
                                type="text" 
                                value={SearchInput}
                                onChange={handleSearchInput}
                                placeholder="search"
                                />
                            </div>
                            <div className="branch-name">
                                {user ? (
                                    <>
                                    <p>{user.branch} Branch</p>
                                    </>
                                ): (
                                    <>
                                    <p>Branch Name</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="dash-main">
                        <div className="main-card">
                            <div className="cards">
                                <div className="transaction-card">
                                    <div className="money-text-icon">
                                        <div className="money-icon">
                                        <FontAwesomeIcon icon={faMoneyBillAlt} />
                                        </div>
                                        <div className="money-text">
                                            <p>MONEY EARNED</p>
                                        </div>
                                    </div>
                                    <div className="money-rate">
                                        <div className="month-money">
                                            <p>current month</p>
                                            <p>$30000</p>
                                        </div>
                                        <div className="year-money">
                                            <p>current financial year</p>
                                            <p>$800000</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="members-cards">
                                    <div className="money-text-icon">
                                        <div className="money-icon">
                                        <FontAwesomeIcon icon={faUser} />
                                        </div>
                                        <div className="money-text">
                                            <p>Total Members</p>
                                        </div>
                                    </div>
                                    <div className="money-rate">
                                        <div className="month-money">
                                            <p>Current Month</p>
                                            <p>22</p>
                                        </div>
                                        <div className="year-money">
                                            <p>Total members</p>
                                            <p>321</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="minor-cards">
                                <div className="policy-card">
                                    <div className="policy-name">
                                        <p>POLICIES</p>
                                    </div>
                                    <div className="Policy-icon-total">
                                        <div className="policy-icon">
                                            <FontAwesomeIcon icon={faFile} />
                                        </div>
                                        <div className="policy-total">
                                            <p>30</p>
                                            <p>New Policies</p>
                                        </div>
                                    </div>
                                    <div className="policy-category">
                                        <div className="pending-policy">
                                            <p>10</p>
                                            <p>pending</p>
                                        </div>
                                        <div className="inBind-policy">
                                            <p>9</p>
                                            <p>In bind</p>
                                        </div>
                                        <div className="closed-policy">
                                            <p>11</p>
                                            <p>Closed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="claims-card">
                                <div className="policy-name">
                                        <p>CLAIMS</p>
                                    </div>
                                    <div className="Policy-icon-total">
                                        <div className="policy-icon">
                                            <FontAwesomeIcon icon={faFile} />
                                        </div>
                                        <div className="policy-total">
                                            <p>30</p>
                                            <p>New Claims</p>
                                        </div>
                                    </div>
                                    <div className="policy-category">
                                        <div className="pending-policy">
                                            <p>10</p>
                                            <p>Paid</p>
                                        </div>
                                        <div className="inBind-policy">
                                            <p>9</p>
                                            <p>Pending</p>
                                        </div>
                                        <div className="closed-policy">
                                            <p>11</p>
                                            <p>Rejected</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="type-transactions">
                                    <div className="type-header">
                                        <p>Insurance Transaction</p>
                                    </div>
                                    <div className="period-select">
                                        <select
                                        id="selectOption"
                                        className="form-control"
                                        value={SelectedOption}
                                        onChange={handleSelectChange}
                                        >
                                            <option value='Today'>Today</option>
                                            <option value='Moth'>Month</option>
                                        </select>
                                    </div>
                                    <div className="insurance-money">
                                        <div className="property-insure">
                                            <p>Property</p>
                                            <p>$3000</p>
                                        </div>
                                        <div className="health-insure">
                                            <p>Health</p>
                                            <p>$5000</p>
                                        </div>
                                        <div className="vehicle-tp">
                                            <p>Vehicles</p>
                                            <p>$80000</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="dash-transaction">
                            <div className="table-info">
                                <div className="download-table-info">
                                    <p>Download Transaction Data here...</p>
                                    <button onClick={handleDownLoadTable}>Download</button>
                                </div>
                                <div className="client-transaction-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Policy No.</th>
                                                <th>Client Name</th>
                                                <th>Insurance Type</th>
                                                <th>Send Amount</th>
                                                <th>Description</th>
                                            </tr>   
                                        </thead>
                                        {
                                            filteredTransactions.length > 0 ? (
                                                <tbody>
                                                    {filteredTransactions.map((transaction) => (
                                                        <tr key={transaction._id}>
                                                        <td>{transaction.policy_number}</td>
                                                        <td>{transaction.client_name}</td>
                                                        <td>{transaction.coverage_type}</td>
                                                        <td>Ksh {transaction.amount}</td>
                                                        <td>{transaction.description}</td>
                                                    </tr>
                                                    ))}
                                        </tbody>
                                            ) : (
                                                <p>No transcations made</p>
                                            )
                                        }
                                        
                                    </table>
                                </div>
                            </div>
                            <div className="payment-mode">
                                <div className="mode-rate">
                                    <div className="bank-transactions">
                                        <p>Bank</p>
                                        <div className="bank-circle" data-progress="36" style={{ '--progress': '36deg' }}>
                                            36%
                                        </div>
                                        <p>$50000</p>
                                    </div>
                                    <div className="mobile-transactions">
                                        <p>Mpesa</p>
                                        <div className="mobile-circle" data-progress="50" style={{ '--progress': '50deg' }}>
                                            50%
                                        </div>
                                        <p>$30000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;