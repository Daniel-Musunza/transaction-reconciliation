import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import { addtransaction } from '../features/transactions/transactionSlice';

function TestForm() {
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
  }, [user, isError, isSuccess, message, dispatch]);

  const [formData, setFormData] = useState({
    policy_number: '',
    amount: '',
  });

  const { policy_number, amount } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      policy_number,
      amount,
      modeOfPay: e.target.modeOfPay.value
    };

    dispatch(addtransaction(userData));
    alert('Payment successful ...');
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <div className='payment-form'>
        <section className='heading' style={{ color: '#ffff'}}>
          <h1>TestForm</h1>
        </section>
        <section className='form'>
          <form onSubmit={onSubmit}>
            <div className='form-group'>
              <input
                type='text'
                className='form-control'
                name='policy_number'
                value={policy_number}
                placeholder='Policy Number'
                onChange={onChange}
              />
            </div>
            <div className='form-group'>
              <input
                type='number'
                className='form-control'
                name='amount'
                value={amount}
                placeholder='Amount'
                onChange={onChange}
              />
            </div>
            <div className="form-group">
              <select name="modeOfPay" id="mode" className='form-control'>
                <option value="Mpesa">Mpesa</option>
                <option value="Bank">Bank</option>
              </select>
            </div>

            <div className='form-group' id='submit-transact'>
              <button type='submit' className='btn btn-block'>
                Submit
              </button>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default TestForm;
