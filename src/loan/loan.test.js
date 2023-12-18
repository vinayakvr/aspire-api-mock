const Loan = require("../models/loan");
const Repayment = require("../models/repayment");
const { createLoan, getLoans, approveLoan, repayLoan } = require("./loan");

jest.mock('../models/repayment'); // Mocking the database models
jest.mock('../models/loan'); // Mocking the database models

describe('createLoan function', () => {
  it('should create a loan and its repayments', async () => {
    const req = {
      body: {
        amount: 1000,
        term: 4,
      },
      userId: 'user123',
    };

    const loanId = 'loan123';
    const repaymentIds = ['repayment1', 'repayment2', 'repayment3', 'repayment4'];

    Loan.create.mockResolvedValue({ id: loanId });
    Repayment.bulkCreate.mockResolvedValue(repaymentIds.map(id => ({ id })));

    const result = await createLoan(req);

    expect(Loan.create).toHaveBeenCalledTimes(1);
    expect(Repayment.bulkCreate).toHaveBeenCalledTimes(1);
    expect(result.message).toBe('loan and repayments created');
    expect(result.loan.id).toBe(loanId);
    expect(result.repayments).toHaveLength(4);
  });

  it('should handle errors during loan creation', async () => {
    const req = {
      body: {
        amount: 1000,
        term: 4,
      },
      userId: 'user123',
    };

    Loan.create.mockRejectedValue(new Error('DB connection failed'));

    await expect(createLoan(req)).rejects.toThrow('error creating loan: DB connection failed');
  });

  it('should handle errors during repayment creation', async () => {
    const req = {
      body: {
        amount: 1000,
        term: 4,
      },
      userId: 'user123',
    };

    const loanId = 'loan123';
    Loan.create.mockResolvedValue({ id: loanId });

    Repayment.bulkCreate.mockRejectedValue(new Error('Repayment creation failed'));

    await expect(createLoan(req)).rejects.toThrow('error creating repayments: Repayment creation failed');
  });

  it('should handle unknown error during repayment creation', async () => {
    const req = {
      body: {
        amount: 1000,
        term: 4,
      },
      userId: 'user123',
    };

    const loanId = 'loan123';
    Loan.create.mockResolvedValue({ id: loanId });

    Repayment.bulkCreate.mockRejectedValue(new Error('Unknown error'));

    await expect(createLoan(req)).rejects.toThrow('error creating repayments: Unknown error');
  });
});

describe('getLoans function', () => {
  it('should should get the list of loans', async () => {
    const req = {
      userId: 'user123',
    };

    Loan.findAll.mockResolvedValue([{ id: 'loan_123', amount: 200 }]);
    const result = await getLoans(req);

    expect(Loan.findAll).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({ data: [{ id: 'loan_123', amount: 200 }] });
    expect(result.data).toHaveLength(1);
  });
});

describe('approveLoan function', () => {
  it('should approve a loan successfully', async () => {
    const loanId = 'loan123';
    const loan = { id: loanId, status: 'PENDING', save: jest.fn().mockResolvedValue(true) };

    Loan.findOne.mockResolvedValue(loan);

    const result = await approveLoan(loanId);

    expect(Loan.findOne).toHaveBeenCalledTimes(1);
    expect(result).toEqual(loan);
    expect(loan.status).toBe('APPROVED');
    expect(loan.save).toHaveBeenCalledTimes(1);
  });

  it('should handle loan not found', async () => {
    const loanId = 'nonExistentLoanId';
    Loan.findOne.mockResolvedValue(null);

    await expect(approveLoan(loanId)).rejects.toThrow('loan not found for the given id');
    expect(Loan.findOne).toHaveBeenCalledTimes(2);
  });

  it('should handle error during loan approval', async () => {
    const loanId = 'loan123';
    const loan = { id: loanId, status: 'PENDING', save: jest.fn().mockRejectedValue(new Error('DB error')) };

    Loan.findOne.mockResolvedValue(loan);

    await expect(approveLoan(loanId)).rejects.toThrow('DB error');
    expect(Loan.findOne).toHaveBeenCalledTimes(3);
    expect(loan.save).toHaveBeenCalledTimes(1);
  });
});

describe('repayLoan function', () => {
  it('should successfully repay the loan and its repayment', async () => {
    const userId = 'user123';
    const loanId = 'loan123';
    const amount = 50;
    const loan = { id: loanId, userId, status: 'PENDING', save: jest.fn().mockResolvedValue(true) };
    const repayment = { id: 'repay123', amount: 50, status: 'PENDING', save: jest.fn().mockResolvedValue(true) };

    Loan.findOne.mockResolvedValue(loan);
    Repayment.findAll.mockResolvedValue([repayment]);

    const result = await repayLoan(userId, loanId, amount);

    expect(Loan.findOne).toHaveBeenCalledTimes(4);
    expect(Repayment.findAll).toHaveBeenCalledTimes(1);
    expect(result.loan).toEqual(loan);
    expect(result.repayments).toEqual([repayment]);
    expect(loan.status).toBe('PAID');
    expect(loan.save).toHaveBeenCalledTimes(1);
    expect(repayment.status).toBe('PAID');
    expect(repayment.save).toHaveBeenCalledTimes(1);
  });

  it('should handle loan not found for the given user', async () => {
    const userId = 'user123';
    const loanId = 'loan123';
    const amount = 50;

    Loan.findOne.mockResolvedValue(null);

    await expect(repayLoan(userId, loanId, amount)).rejects.toThrow('loan not found for the given id for this user');
    expect(Loan.findOne).toHaveBeenCalledTimes(5);
    expect(Repayment.findAll).toHaveBeenCalledTimes(1);
  });

  it('should handle no repayments to pay for', async () => {
    const userId = 'user123';
    const loanId = 'loan123';
    const amount = 50;
    const loan = { id: loanId, userId, status: 'PENDING', save: jest.fn().mockResolvedValue(true) };

    Loan.findOne.mockResolvedValue(loan);
    Repayment.findAll.mockResolvedValue([]);

    await expect(repayLoan(userId, loanId, amount)).rejects.toThrow('no repayments to pay for');
    expect(Loan.findOne).toHaveBeenCalledTimes(6);
    expect(Repayment.findAll).toHaveBeenCalledTimes(2);
  });

  it('should handle error during loan repayment', async () => {
    const userId = 'user123';
    const loanId = 'loan123';
    const amount = 50;
    const loan = { id: loanId, userId, status: 'PENDING', save: jest.fn().mockResolvedValue(true) };
    const repayment = { id: 'repay123', amount: 50, status: 'PENDING', save: jest.fn().mockRejectedValue(new Error('DB error')) };

    Loan.findOne.mockResolvedValue(loan);
    Repayment.findAll.mockResolvedValue([repayment]);

    await expect(repayLoan(userId, loanId, amount)).rejects.toThrow('DB error');
    expect(Loan.findOne).toHaveBeenCalledTimes(7);
    expect(Repayment.findAll).toHaveBeenCalledTimes(3);
    expect(repayment.save).toHaveBeenCalledTimes(1);
    expect(loan.save).not.toHaveBeenCalled();
  });
});
