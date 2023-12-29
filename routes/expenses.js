const path=require('path')

const express=require('express')

const expenseController=require('../controller/expenses');
const UserAuthenticate=require('../MiddleWare/authentication')

const router=express.Router()

router.post('/expense/post-expense',UserAuthenticate.authenticate ,expenseController.postExpense)

router.get('/expense/get-expenses',UserAuthenticate.authenticate,expenseController.getExpenses)

router.delete('/expense/delete-expense/:id',UserAuthenticate.authenticate,expenseController.deleteExpense)

router.get('/download',UserAuthenticate.authenticate,expenseController.downloadExpense)

module.exports = router;