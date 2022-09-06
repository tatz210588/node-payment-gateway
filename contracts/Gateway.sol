// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;
 
import '@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';
import '@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
 
contract Gateway is
  Initializable,
  ERC20Upgradeable,
  ReentrancyGuardUpgradeable,
  OwnableUpgradeable
{

  address payable public companyWallet;

  function initialize() public initializer {
    __ERC20_init('', '');
    __ReentrancyGuard_init();
    __Ownable_init();
    companyWallet = payable(msg.sender);
  }

  receive() payable external{

  }

 fallback() payable external{
   //payable(msg.data).transfer(msg.value);
 }


  function tranferNative(address payable seller) external payable {
        uint256 myProfit = (msg.value * 2)/100;
        uint256 amountToBeTransferred = msg.value - myProfit;
        seller.transfer(amountToBeTransferred);
        companyWallet.transfer(myProfit);
  }
  
  function tranferNonNative(address payable seller, address payable token, uint256 amount) external payable {
        uint256 myProfit = (amount * 2)/100;
        uint256 amountToBeTransferred = amount - myProfit;
        IERC20Upgradeable(token).transferFrom(msg.sender, seller, amountToBeTransferred);
        IERC20Upgradeable(token).transferFrom(msg.sender, companyWallet, myProfit);
  }
  
}