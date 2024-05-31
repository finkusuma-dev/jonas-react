import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AccountAction } from './accountSlice';

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurpose, setLoanPurpose] = useState('');
  const [currency, setCurrency] = useState('USD');
  const dispath = useDispatch();

  const {loan: currentLoan, loanPurpose: currentLoanPurpose} = useSelector((store) => store.account);

  function handleDeposit() {
    if (!depositAmount) return;
    dispath(AccountAction.deposit(depositAmount));
    setDepositAmount('');
  }

  function handleWithdrawal() {
    if (!withdrawalAmount) return;
    dispath(AccountAction.withdrawal(withdrawalAmount));
    setWithdrawalAmount('');
  }

  function handleRequestLoan() {
    if (!loanAmount) return;
    dispath(AccountAction.requestLoan(loanAmount, loanPurpose));
  }

  function handlePayLoan() {
    if (!currentLoan) return;
    dispath(AccountAction.payLoan());
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={handleDeposit}>Deposit {depositAmount}</button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(+e.target.value)}
          />
          <button onClick={handleWithdrawal}>
            Withdraw {withdrawalAmount}
          </button>
        </div>

        {!currentLoan ? (
          <div>
            <label>Request loan</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(+e.target.value)}
              placeholder="Loan amount"
            />
            <input
              value={loanPurpose}
              onChange={(e) => setLoanPurpose(e.target.value)}
              placeholder="Loan purpose"
            />
            <button onClick={handleRequestLoan}>Request loan</button>
          </div>
        ) : (
          <div>
            <span>Pay back ${currentLoan} ({currentLoanPurpose})</span>&nbsp;
            <button onClick={handlePayLoan}>Pay loan</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountOperations;
