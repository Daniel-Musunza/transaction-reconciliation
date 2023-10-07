import { faFile, faHome, faMoneyBillAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


import { CartesianGrid, Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';
import { fetchUsers, reset } from '../../features/auth/authSlice';
import { gettransactions } from "../../features/transactions/transactionSlice";

function Dashboard() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    //redux stuff
    const { user } = useSelector((state) => state.auth);
    const { transactions, isError, message } = useSelector((state) => state.transactions);
    const { users } = useSelector((state) => state.auth);
    
    
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
      
      useEffect(() => {
        dispatch(fetchUsers());

        return () => {
            dispatch(reset());
        }
      },[dispatch]);


      //filter transation list according to insurance branch
      const filteredTransactions = transactions.filter(
        (transaction) =>
          transaction.branch === user.branch
      );

      //filter branch users
      const filterUsers = users.filter(
        (member) => member.branch === user.branch&&member.coverage_type !== ''&&member.policy_number !== ''
      );
      //filter paid policies

      const filterPaidPolicies = users.filter(
        (member) => member.branch === user.branch&&member.coverage_type !== ''&&member.policy_number !== ''&&member.annual_premium !== null
      );

      //getting the total transactions according to names
      const findUserByName =  users.filter(
        (member) => member.branch === user.branch&&member.coverage_type !== ''&&member.name
      );

      const findTransactionByName = transactions.filter(
        (transaction) => transaction.branch === user.branch&&transaction.client_name
      );

      const clientNames = findUserByName.map((user) => user.name);
      const transactionNames = findTransactionByName.map((transaction) => transaction.client_name);
        // console.log('accessNames', clientNames);
        // console.log('transactionNames', transactionNames);

        const matchingNames = clientNames.filter((clientName) => transactionNames.includes(clientName));

        // console.log('Matching names:', matchingNames);

        const transactionTotals = {};

        // Calculate total transactions for each matching name
        transactions.forEach((transaction) => {
        if (matchingNames.includes(transaction.client_name)) {
            if (transactionTotals[transaction.client_name]) {
            transactionTotals[transaction.client_name] += transaction.amount;
            } else {
            transactionTotals[transaction.client_name] = transaction.amount;
            }
        }
        });

    console.log('Transaction Totals for Matching Names:', transactionTotals);

    const premiumMatches = clientNames.map((clientName) => {
        const user = filterPaidPolicies.find((user) => user.name === clientName);
        const totalTransactionAmount = transactionTotals[clientName] || 0;
        const annualPremium = user ? user.annual_premium : null;
        const matches = annualPremium !== null && totalTransactionAmount === annualPremium;
        return { clientName, matches };
      });
      
    //   console.log('Premium Matches:', premiumMatches);
      const trueMatchesCount = premiumMatches.filter((item) => item.matches).length;
        const falseMatchesCount = premiumMatches.filter((item) => !item.matches).length;

        // console.log('Number of true matches:', trueMatchesCount);
        // console.log('Number of false matches:', falseMatchesCount);
    //filter montly created users 
        const filterMonthUsers = filterUsers.filter((member) => {
            const currentDate = new Date().toISOString().split('T')[0];
            const currentYear = new Date(currentDate).getFullYear();
            const currentMonth = new Date(currentDate).getMonth() +1;

            const createdDate = new Date(member.createdAt);
            const createdYear = createdDate.getFullYear();
            const createdMonth = createdDate.getMonth() +1;

            return createdYear === currentYear&&createdMonth === currentMonth;
        });
       
    //filter yearly created users
    // const filterYearUsers = filterUsers.filter((member) => {
    //     const currentDate = new Date().toISOString().split('T')[0];
    //     const currentYear = new Date(currentDate).getFullYear();
    
    //     const createdDate = new Date(member.createdAt);
    //     const createdYear = createdDate.getFullYear();

    //     return createdYear === currentYear;
    // });

            //filter transactions according  to current month

            const currentDate = new Date().toISOString().split('T')[0];
            const currentYear = new Date(currentDate).getFullYear();
            const currentMonth = new Date(currentDate).getMonth() +1;
            const currentDay = new Date(currentDate).getDay();

            const filterMonth = filteredTransactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date_of_payment);
                const transactionYear = transactionDate.getFullYear();
                const transactionMonth = transactionDate.getMonth() +1;
                return transactionYear === currentYear&&transactionMonth === currentMonth;
            });

            //filter transaction according to curreny Year
            const filterYear = filteredTransactions.filter((transaction) => {
                const transactionDate = new Date(transaction.date_of_payment);
                const transactionYear = transactionDate.getFullYear();
                return transactionYear === currentYear;
            });
            
            //filter transaction according to day 

            const filterToday = filteredTransactions.filter((transaction) => {
                const transactionDate = new Date (transaction.date_of_payment);
                const transactionYear = transactionDate.getFullYear();
                const transactionMonth = transactionDate.getMonth() + 1
                const transactionDay = transactionDate.getDay();

                return currentYear === transactionYear&&
                        currentMonth === transactionMonth&&
                        currentDay === transactionDay;
            });
            // console.log('filter Day',filterToday );
          
              
              
            //   console.log('Updated monthly data:', updatedMonthlyData);
            
            //table data
            
                
             
            //sum of branch money according to year 
            let sumOfYearlyBranchMoney = 0;
            filterYear.forEach((transaction) => {
                sumOfYearlyBranchMoney+= transaction.amount;
            });

            
            //sum of branch money according to month
            let sumOfMonthlyBranchMoney = 0;
            filterMonth.forEach((transaction) => {
                sumOfMonthlyBranchMoney+= transaction.amount;
            });

            //filter monthly health insurance according to month
            const filterMonthlyHealth = filterMonth.filter(
            (transaction) => transaction.coverage_type === 'Health'
            );
                //sum of monthly health insurance transactions
            let sumOfHealthMonthTransaction = 0;
                filterMonthlyHealth.forEach(transaction => sumOfHealthMonthTransaction += transaction.amount);
                // console.log('sumOfHealthMonthTransaction',sumOfHealthMonthTransaction)
            //filter property monthly insurance transactions

            const filterMonthlyProperty = filterMonth.filter(
                (transaction) => transaction.coverage_type === 'Property'
            );
                //sum of monthly property insurance transaction
                let sumOfPropertyMonthTransaction = 0;
                filterMonthlyProperty.forEach(transaction => sumOfPropertyMonthTransaction += transaction.amount);

                //vehicle insurance money
                //PrivateVehicle/Comprehensive
                const filterMonthlyPrivateVC = filterMonth.filter(
                    (transaction) => transaction.coverage_type === 'PrivateVehicle/Comprehensive'
                );
                    //sum of monthly PrivateVehicle/Comprehensive insurance transaction
                    let sumOfPrivateVCMonthTransaction = 0;
                    filterMonthlyPrivateVC.forEach(transaction => sumOfPrivateVCMonthTransaction += transaction.amount);

                    //PrivateVehicle/ThirdParty
                    const filterMonthlyPrivateVTP = filterMonth.filter(
                        (transaction) => transaction.coverage_type === 'PrivateVehicle/ThirdParty'
                    );
                        //sum of monthly PrivateVehicle/ThirdParty insurance transaction
                        let sumOfPrivateVTPMonthTransaction = 0;
                        filterMonthlyPrivateVTP.forEach(transaction => sumOfPrivateVTPMonthTransaction += transaction.amount);

                        //CommercialVehicle/Comprehensive
                        const filterMonthlyCommercialVC = filterMonth.filter(
                            (transaction) => transaction.coverage_type === 'CommercialVehicle/Comprehensive'
                        );
                            //sum of monthly CommercialVehicle/Comprehensive insurance transaction
                            let sumOfCommercialVCMonthTransaction = 0;
                            filterMonthlyCommercialVC.forEach(transaction => sumOfCommercialVCMonthTransaction += transaction.amount);
                        
                        //CommercialVehicle/ThirdParty

                        const filterMonthlyCommercialVTP = filterMonth.filter(
                            (transaction) => transaction.coverage_type === 'CommercialVehicle/ThirdParty'
                        );
                            //sum of monthly CommercialVehicle/Comprehensive insurance transaction
                            let sumOfCommercialVTPMonthTransaction = 0;
                            filterMonthlyCommercialVTP.forEach(transaction => sumOfCommercialVTPMonthTransaction += transaction.amount);

                            let totalVehicleMonthInsurance = sumOfPrivateVCMonthTransaction + sumOfPrivateVTPMonthTransaction
                                                            + sumOfCommercialVCMonthTransaction + sumOfCommercialVTPMonthTransaction;


        //todays transactions
        // let sumOfDayBranchMoney = 0;
        // filterToday.forEach((transaction) => {
        //     sumOfDayBranchMoney+= transaction.amount;
        // });

        //filter today health insurance according to month
        const filterTodayHealth = filterToday.filter(
        (transaction) => transaction.coverage_type === 'Health'
        );
            //sum of today health insurance transactions
        let sumOfHealthTodayTransaction = 0;
            filterTodayHealth.forEach(transaction => sumOfHealthTodayTransaction += transaction.amount);
        //filter property today insurance transactions

        const filterTodayProperty = filterToday.filter(
            (transaction) => transaction.coverage_type === 'Property'
        );
            //sum of today property insurance transaction
            let sumOfPropertyTodayTransaction = 0;
            filterTodayProperty.forEach(transaction => sumOfPropertyTodayTransaction += transaction.amount);

            //vehicle insurance money
            //PrivateVehicle/Comprehensive
            const filterTodayPrivateVC = filterToday.filter(
                (transaction) => transaction.coverage_type === 'PrivateVehicle/Comprehensive'
            );
                //sum of monthly PrivateVehicle/Comprehensive insurance transaction
                let sumOfPrivateVCTodayTransaction = 0;
                filterTodayPrivateVC.forEach(transaction => sumOfPrivateVCTodayTransaction += transaction.amount);

                //PrivateVehicle/ThirdParty
                const filterTodayPrivateVTP = filterToday.filter(
                    (transaction) => transaction.coverage_type === 'PrivateVehicle/ThirdParty'
                );
                    //sum of monthly PrivateVehicle/ThirdParty insurance transaction
                    let sumOfPrivateVTPTodayTransaction = 0;
                    filterTodayPrivateVTP.forEach(transaction => sumOfPrivateVTPTodayTransaction += transaction.amount);

                    //CommercialVehicle/Comprehensive
                    const filterTodayCommercialVC = filterToday.filter(
                        (transaction) => transaction.coverage_type === 'CommercialVehicle/Comprehensive'
                    );
                        //sum of monthly CommercialVehicle/Comprehensive insurance transaction
                        let sumOfCommercialVCTodayTransaction = 0;
                        filterTodayCommercialVC.forEach(transaction => sumOfCommercialVCTodayTransaction += transaction.amount);
                    
                    //CommercialVehicle/ThirdParty

                    const filterTodayCommercialVTP = filterToday.filter(
                        (transaction) => transaction.coverage_type === 'CommercialVehicle/ThirdParty'
                    );
                        //sum of monthly CommercialVehicle/Comprehensive insurance transaction
                        let sumOfCommercialVTPTodayTransaction = 0;
                        filterTodayCommercialVTP.forEach(transaction => sumOfCommercialVTPTodayTransaction += transaction.amount);

                        let totalVehicleTodayInsurance = sumOfPrivateVCTodayTransaction + sumOfPrivateVTPTodayTransaction
                                                        + sumOfCommercialVCTodayTransaction + sumOfCommercialVTPTodayTransaction;
    
                                                                                                              

    const[SelectedOption, setSelectedOption] = useState('Today');

    const handleSelectChange = (e) => {
        setSelectedOption(e.target.value);
    }

    const[FilteredTransaction, setFilteredTransaction] = useState({
        property: 0,
        health: 0,
        vehicle: 0
    });
    useEffect(() => {
        if(SelectedOption === 'Today') {
            setFilteredTransaction({
                property: sumOfPropertyTodayTransaction,
                health: sumOfHealthTodayTransaction,
                vehicle: totalVehicleTodayInsurance
            }
            )
        } else if (SelectedOption === 'Month') {
            setFilteredTransaction({
                property: sumOfPropertyMonthTransaction,
                health: sumOfHealthMonthTransaction,
                vehicle: totalVehicleMonthInsurance
            }
                
            )
        }
    }, [SelectedOption, sumOfHealthTodayTransaction,sumOfPropertyTodayTransaction,
        totalVehicleTodayInsurance,sumOfPropertyMonthTransaction,sumOfHealthMonthTransaction,
        totalVehicleMonthInsurance
    ]);
    console.log('FilteredTransaction',FilteredTransaction.health)
    const filterModeOfPay = filteredTransactions.filter((transaction) => {
        const ModeOfPayment = transaction.modeOfPay;
        return ModeOfPayment;
      });
    //   console.log('filterModeOfPay', filterModeOfPay);

      //filter transaction made through mpesa
      const filterMpesaPayment = filterModeOfPay.filter((transaction) => {
        const mpesa = transaction.modeOfPay === 'Mpesa';
        return mpesa;
      });
      //mpesa transactions in percentage
      const mpesaDegrees = (filterMpesaPayment.length / filterModeOfPay.length) * 360;
      const mpesaPercentage = Math.floor((filterMpesaPayment.length / filterModeOfPay.length) * 100);
      
      let totalMpesaMoney = 0;
      filterMpesaPayment.forEach((mpesa) => {
        totalMpesaMoney += mpesa.amount;
      });
    //   console.log('Total Mpesa Money: ' + totalMpesaMoney);
      
      //filter transactions made througn bank
      const filterBankPayment = filterModeOfPay.filter((transaction) => {
        const bank = transaction.modeOfPay === 'Bank';
        return bank;
      } );
    //   console.log('filterbankpayment',filterBankPayment);
      //bank transactions in percentage
      const bankDegrees = (filterBankPayment.length / filterModeOfPay.length) * 360;
      const bankPercentage = Math.floor((filterBankPayment.length / filterModeOfPay.length) * 100);

      let totalBankMoney = 0;
      filterBankPayment.forEach((bank) => {
        totalBankMoney += bank.amount;
      });


      //get transaction send by day and send them

      //transaction graph data here
      const months = ['January', 'February', 'March', 'April', 'May', 'June','July', 'August', 'September', 'October', 'November', 'December']
      const monthlyTransactionTotal = {
          January: null,
          February: null,
          March: null,
          April: null,
          May: null,
          June: null,
          July: null,
          August: null,
          September: null,
          October: null,
          November: null,
          December: null
        };
        
        filterYear.forEach((transaction) => {
          const transactionDate = new Date(transaction.date_of_payment);
          const monthIndex = transactionDate.getMonth();
          const monthOfYear = months[monthIndex];
          monthlyTransactionTotal[monthOfYear] += transaction.amount;
          // console.log('Total transactions for :', monthlyTransactionTotal);
        });
        
        const monthlyData = [
          { name: 'January', value: 0 },
          { name: 'February', value: 0 },
          { name: 'March', value: 0 },
          { name: 'April', value: 0 },
          { name: 'May', value: 0 },
          { name: 'June', value: 0 },
          { name: 'August', value: 0 },
          { name: 'September', value: 0 },
          { name: 'October', value: 0 },
          { name: 'November', value: 0 },
          { name: 'December', value: 0 },
        ];

        const updatedMonthlyData = monthlyData.map((item) => ({
            ...item,
            value: monthlyTransactionTotal[item.name]
          }));
        
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
                                {/* <Link to="/home">
                                    <FontAwesomeIcon icon={faHeart}/>
                                    <p>Health</p>
                                    
                                </Link> */}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="dash-content">
                    {/* <div className="dash-header">
                        <div className="dash-log">
                            <h2>Dashboard</h2>
                        </div>
                        <div className="header-detail">
                            
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
                    </div> */}
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
                                            <p>Ksh {sumOfMonthlyBranchMoney}</p>
                                        </div>
                                        <div className="year-money">
                                            <p>current financial year</p>
                                            <p>Ksh {sumOfYearlyBranchMoney}</p>
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
                                            <p>{filterMonthUsers.length}</p>
                                        </div>
                                        <div className="year-money">
                                            <p>Total members</p>
                                            <p>{filterUsers.length}</p>
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
                                            <p>{filterUsers.length}</p>
                                            <p>New Policies</p>
                                        </div>
                                    </div>
                                    <div className="policy-category">
                                        <div className="pending-policy">
                                            <p>{falseMatchesCount}</p>
                                            <p>pending</p>
                                        </div>
                                        {/* <div className="inBind-policy">
                                            <p>9</p>
                                            <p>In bind</p>
                                        </div> */}
                                        <div className="closed-policy">
                                            <p>{trueMatchesCount}</p>
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
                                            <option value='Month'>Month</option>
                                        </select>
                                    </div>
                                    <div className="insurance-money">
                                        
            
                                        <div  className="property-insure">
                                            <p>Property</p>
                                            <p>Ksh {FilteredTransaction.property}</p>
                                        </div>
                                        <div className="health-insure">
                                            <p>Health</p>
                                            <p>Ksh {FilteredTransaction.health}</p>
                                        </div>
                                        <div className="vehicle-tp">
                                            <p>Vehicles</p>
                                            <p>ksh {FilteredTransaction.vehicle}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                        <div className="dash-transaction">
                            <div className="transactions-graph">
                                <p>Transaction Graph</p>
                                <LineChart width={600} height={300} backgroundColor='white' data={updatedMonthlyData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name"  label={{ value: 'Month', position: 'insideBottom', offset: -10 }}/>
                                    <YAxis label={{value: 'Money in Ksh', position: 'insideLeft', angle:'-90' }}/>
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="value" stroke="#8884d8"  />
                                </LineChart>
                            </div>
                            <div className="payment-mode">
                                <div className="mode-rate">
                                    <div className="bank-transactions">
                                        <p>Bank</p>
                                        <div className="bank-circle" data-progress={isNaN(bankPercentage) ? 0 : bankPercentage} style={{ '--progress': `${isNaN(bankDegrees)? 0 : bankDegrees}deg` }}>
                                            {/* 36% */}
                                        </div>
                                        <p>Ksh {totalBankMoney}</p>
                                    </div>
                                    <div className="mobile-transactions">
                                        <p>Mpesa</p>
                                        <div className="mobile-circle" data-progress={isNaN(mpesaPercentage) ? 0 : mpesaPercentage} style={{ '--progress': `${isNaN(mpesaDegrees) ? 0 : mpesaDegrees}deg` }}>
                                            {/* 50% */}
                                        </div>
                                        <p>Ksh {totalMpesaMoney}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
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
                                                <th>Mode of Pay</th>
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
                                                        <td>{transaction.modeOfPay}</td>
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
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;