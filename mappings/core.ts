import { BigInt, store } from "@graphprotocol/graph-ts";
import {
  Lend,
  Rent,
  StopRent,
  RentClaimed,
  StopLend,
} from "../generated/Registry/Registry";
import { Lending, Renting, User, LendingRentingCount } from "../generated/schema";
import { fetchUser } from "./helpers";

let lrc = new LendingRentingCount("lendingRentingCount");
lrc.lending = BigInt.fromI32(0);
lrc.renting = BigInt.fromI32(0);
lrc.save();

export function handleLend(event: Lend): void {
  let lentParams = event.params;
  let lending = new Lending(lentParams.lendingID.toString());
  lending.nftAddress = lentParams.nftAddress;
  lending.tokenID = lentParams.tokenID;
  lending.lenderAddress = lentParams.lenderAddress;
  lending.maxRentDuration = BigInt.fromI32(lentParams.maxRentDuration);
  lending.dailyRentPrice = lentParams.dailyRentPrice;
  lending.paymentToken = BigInt.fromI32(lentParams.paymentToken);
  lending.rentClaimed = false;
  lending.lendAmount = BigInt.fromI32(lentParams.lendAmount);
  lending.availableAmount = BigInt.fromI32(lentParams.lendAmount);
  lending.is721 = lentParams.is721;
  let lender = fetchUser(lentParams.lenderAddress);
  lending.userID = lender.id;
  lrc.lending = lrc.lending.plus(BigInt.fromI32(1));
  lrc.save();
  lending.save();
  lender.save();
}

export function handleRent(event: Rent): void {
  let rentedParams = event.params;
  let lendingId = rentedParams.lendingID.toString();
  let rentingId = rentedParams.rentingID.toString();
  let lending = Lending.load(lendingId);
  let renting = new Renting(rentingId);
  renting.renterAddress = rentedParams.renterAddress;
  renting.rentDuration = BigInt.fromI32(rentedParams.rentDuration);
  renting.rentedAt = rentedParams.rentedAt;
  renting.expired = false;
  renting.lendingID = lendingId;
  renting.rentAmount = BigInt.fromI32(rentedParams.rentAmount);
  lending.availableAmount = lending.availableAmount.minus(renting.rentAmount);
  let renter = fetchUser(rentedParams.renterAddress);
  renting.userID = renter.id;
  lrc.renting = lrc.renting.plus(BigInt.fromI32(1));
  lrc.save();
  lending.save();
  renting.save();
  renter.save();
}

export function handleStopRent(event: StopRent): void {
  let returnParams = event.params;
  let renting = Renting.load(returnParams.rentingID.toString());
  let lending = Lending.load(renting.lendingID);
  lending.availableAmount = lending.availableAmount.plus(renting.rentAmount);
  let renter = User.load(renting.renterAddress.toHexString());
  store.remove("Renting", renting.id);
  lrc.renting = lrc.renting.minus(BigInt.fromI32(1));
  lrc.save();
  renter.save();
  lending.save();
}

export function handleRentClaimed(event: RentClaimed): void {
  let claimParams = event.params;
  let renting = Renting.load(claimParams.rentingID.toString());
  let lending = Lending.load(renting.lendingID);
  lending.availableAmount = lending.availableAmount.plus(renting.rentAmount);
  renting.expired = true;
  lending.rentClaimed = true;
  lrc.renting = lrc.renting.minus(BigInt.fromI32(1));
  lrc.save();
  renting.save();
  lending.save();
}

export function handleStopLend(event: StopLend): void {
  let lendingStopParams = event.params;
  let lending = Lending.load(lendingStopParams.lendingID.toString());
  lrc.lending = lrc.lending.minus(BigInt.fromI32(1));
  lrc.save();
  store.remove('Lending', lending.id);
}
