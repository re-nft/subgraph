import {LendingStopped, Lent, Rented} from "../generated/Azrael/Azrael";
import {newMockEvent, assert} from 'matchstick-as/assembly/index'
import {Address, BigInt, Bytes, ethereum} from '@graphprotocol/graph-ts'
import { Renting } from "../generated/schema";

export const RENTING_ENTITY = "Renting";
export const LENDING_ENTITY = "Lending";
export const COUNTER_ENTITY = "Counter";
export const USER_ENTITY = "User";
export const LENDING_RENTING_COUNTER_ENTITY = "LendingRentingCount";
export const NFT_ENTITY = "Nft";


export function createNewLendingStoppedEvent(
    lendingId: string,
    stoppedAt: i32
): LendingStopped {
    let mockEvent = newMockEvent();

    let newLendingStoppedEvent =  new LendingStopped(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
        mockEvent.receipt
    );

    newLendingStoppedEvent.parameters = new Array()

    let lendingIdValue = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(lendingId));
    let stoppedAtValue = ethereum.Value.fromI32(stoppedAt);

    let _lendingId = new ethereum.EventParam("lendingId", lendingIdValue);
    let _stoppedAt = new ethereum.EventParam("stoppedAt", stoppedAtValue);

    newLendingStoppedEvent.parameters.push(_lendingId);
    newLendingStoppedEvent.parameters.push(_stoppedAt);

    return newLendingStoppedEvent
}

export function createMultipleNewRentedEvents(
    lendings: Array<Lent>,
    renterAddress: string,
    rentDuration: i32,
    rentedAtOffset: i32,
): Array<Rented> {
    let newRentedEvents: Array<Rented> = new Array<Rented>();
    for(let i = 0; i < lendings.length; i++){
        let newRentedEvent = createNewRentedEvent(
            lendings[i].params.lendingId.toString(),
            renterAddress,
            rentDuration,
            lendings[i].block.timestamp.plus(BigInt.fromI32(rentedAtOffset)).toI32()
        )

        newRentedEvents.push(newRentedEvent)
    }

    return newRentedEvents
}

export function createNewRentedEvent(
    lendingId: string,
    renterAddress: string,
    rentDuration: i32,
    rentedAt: i32
): Rented {
    let mockEvent = newMockEvent();

    let newRentedEvent =  new Rented(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
        mockEvent.receipt
    );

    newRentedEvent.parameters = new Array()

    let lendingIdValue = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(lendingId))
    let renterAddressValue = ethereum.Value.fromAddress(Address.fromString(renterAddress))
    let rentDurationValue = ethereum.Value.fromI32(rentDuration)
    let rentedAtValue = ethereum.Value.fromI32(rentedAt)

    let _lendingId = new ethereum.EventParam("lendingId", lendingIdValue)
    let _renterAddress = new ethereum.EventParam('renterAddress', renterAddressValue)
    let _rentDuration = new ethereum.EventParam('rentDuration', rentDurationValue)
    let _rentedAt = new ethereum.EventParam('rentedAt', rentedAtValue)

    // ORDER IS IMPORTANT!!
    newRentedEvent.parameters.push(_lendingId)
    newRentedEvent.parameters.push(_renterAddress)
    newRentedEvent.parameters.push(_rentDuration)
    newRentedEvent.parameters.push(_rentedAt)

    return newRentedEvent;
}

export function createMultipleNewLentEvents(
    numberOfEvents: number,
    nftAddress: string,
    lenderAddress: string,
    maxRentDuration: i32,
    dailyRentPrice: string,
    nftPrice: string,
    paymentToken: i32,
    lentAmount: i32,
    isERC721: boolean
): Array<Lent> {
    let lentEvents = new Array<Lent>();
    for (let i = 1; i < numberOfEvents + 1; i++) {
        let newLentEvent = createNewLentEvent(
            i.toString(),
            nftAddress,
            i,
            lenderAddress,
            maxRentDuration,
            dailyRentPrice,
            nftPrice,
            paymentToken,
            lentAmount,
            isERC721
        )
        lentEvents.push(newLentEvent);
    }
    return lentEvents;
}

export function createNewLentEvent(
    id: string,
    nftAddress: string,
    tokenId: i32,
    lenderAddress: string,
    maxRentDuration: i32,
    dailyRentPrice: string,
    nftPrice: string,
    paymentToken: i32,
    lentAmount: i32,
    isERC721: boolean
): Lent {
    let mockEvent = newMockEvent();

    let newLentEvent =  new Lent(
        mockEvent.address,
        mockEvent.logIndex,
        mockEvent.transactionLogIndex,
        mockEvent.logType,
        mockEvent.block,
        mockEvent.transaction,
        mockEvent.parameters,
        mockEvent.receipt
    );

    newLentEvent.parameters = new Array()

    let lendingIdValue = ethereum.Value.fromUnsignedBigInt(BigInt.fromString(id))
    let nftAddressValue = ethereum.Value.fromAddress(Address.fromString(nftAddress))
    let tokenIdValue = ethereum.Value.fromI32(tokenId)
    let lenderAddressValue = ethereum.Value.fromAddress(Address.fromString(lenderAddress))
    let maxRentDurationValue = ethereum.Value.fromI32(maxRentDuration)
    let dailyRentPriceValue = ethereum.Value.fromBytes(Bytes.fromHexString(dailyRentPrice))
    let nftPriceValue = ethereum.Value.fromBytes(Bytes.fromHexString(nftPrice))
    let paymentTokenValue = ethereum.Value.fromI32(paymentToken)
    let lentAmountValue = ethereum.Value.fromI32(lentAmount)
    let isERC721Value = ethereum.Value.fromBoolean(isERC721)

    let _lendingId = new ethereum.EventParam("id", lendingIdValue)
    let _nftAddress = new ethereum.EventParam("nftAddress", nftAddressValue);
    let _tokenId = new ethereum.EventParam("tokenId", tokenIdValue);
    let _lenderAddress = new ethereum.EventParam("lenderAddress", lenderAddressValue);
    let _maxRentDuration = new ethereum.EventParam("maxRentDuration", maxRentDurationValue);
    let _dailyRentPrice = new ethereum.EventParam("dailyRentPrice", dailyRentPriceValue);
    let _nftPrice = new ethereum.EventParam("nftPrice", nftPriceValue);
    let _paymentToken = new ethereum.EventParam("paymentToken", paymentTokenValue);
    let _lentAmount = new ethereum.EventParam("lentAmount", lentAmountValue);
    let _isERC721 = new ethereum.EventParam("isERC721", isERC721Value);

    // ORDER IS IMPORTANT!!!
    newLentEvent.parameters.push(_nftAddress)
    newLentEvent.parameters.push(_tokenId)
    newLentEvent.parameters.push(_lentAmount)
    newLentEvent.parameters.push(_lendingId)
    newLentEvent.parameters.push(_lenderAddress)
    newLentEvent.parameters.push(_maxRentDuration)
    newLentEvent.parameters.push(_dailyRentPrice)
    newLentEvent.parameters.push(_nftPrice)
    newLentEvent.parameters.push(_isERC721)
    newLentEvent.parameters.push(_paymentToken)

    return newLentEvent;
}

export function assertRentingFields(
    lendingId: string,
    renterAddress: string,
    rentDuration: i32,
    rentedAt: i32,
    cursor: i32
): void {
    assert.fieldEquals(RENTING_ENTITY, lendingId, "id", lendingId);
    assert.fieldEquals(RENTING_ENTITY, lendingId, "renterAddress", renterAddress);
    assert.fieldEquals(RENTING_ENTITY, lendingId, "rentedAt", rentedAt.toString());
    assert.fieldEquals(RENTING_ENTITY, lendingId, "rentDuration", rentDuration.toString());
    assert.fieldEquals(RENTING_ENTITY, lendingId, "lending", lendingId);
    assert.fieldEquals(RENTING_ENTITY, lendingId, "cursor", cursor.toString());
}

export function assertLendingFields(
    id: string,
    nftAddress: string,
    tokenId: i32,
    lenderAddress: string,
    maxRentDuration: i32,
    dailyRentPrice: string,
    nftPrice: string,
    paymentToken: i32,
    lentAmount: i32,
    isERC721: boolean,
    cursor: i32,
    collateralClaimed: boolean,
    lentAt: BigInt,
    hasRenting: boolean = false,
): void {
    assert.fieldEquals(LENDING_ENTITY, id, "nftAddress", nftAddress)
    assert.fieldEquals(LENDING_ENTITY, id, "tokenId", tokenId.toString())
    assert.fieldEquals(LENDING_ENTITY, id, "lenderAddress", lenderAddress)
    assert.fieldEquals(LENDING_ENTITY, id, "maxRentDuration", maxRentDuration.toString())
    assert.fieldEquals(LENDING_ENTITY, id, "dailyRentPrice", dailyRentPrice)
    assert.fieldEquals(LENDING_ENTITY, id, "nftPrice", nftPrice)
    assert.fieldEquals(LENDING_ENTITY, id, "paymentToken", paymentToken.toString())
    assert.fieldEquals(LENDING_ENTITY, id, "lentAmount", lentAmount.toString())
    assert.fieldEquals(LENDING_ENTITY, id, "isERC721", isERC721.toString())
    assert.fieldEquals(LENDING_ENTITY, id, "cursor", cursor.toString())
    assert.fieldEquals(LENDING_ENTITY, id, "collateralClaimed", collateralClaimed.toString())
    assert.fieldEquals(LENDING_ENTITY, id, "lentAt", lentAt.toString())

    if (hasRenting) {
        let renting = Renting.load(id);
        
        assert.assertNotNull(renting);
    } else {
        let renting = Renting.load(id);
        
        assert.assertNull(renting);
    }
}

export function assertCounterFields(
    lendingCount: i32,
    rentingCount: i32,
    userCount: i32
): void{
    assert.fieldEquals(COUNTER_ENTITY, "counter", "lending", lendingCount.toString())
    assert.fieldEquals(COUNTER_ENTITY, "counter", "renting", rentingCount.toString())
    assert.fieldEquals(COUNTER_ENTITY, "counter", "user", userCount.toString())
}

export function assertUserFields(
    address: string,
    cursor: i32
): void {
    assert.fieldEquals(USER_ENTITY, address, "id", address)
    assert.fieldEquals(USER_ENTITY, address, "cursor", cursor.toString())
}

export function assertLendingRentingCounterFields(
    lendingCount: i32,
    rentingCount: i32
): void{
    assert.fieldEquals(LENDING_RENTING_COUNTER_ENTITY, "lendingRentingCount", "lending", lendingCount.toString())
    assert.fieldEquals(LENDING_RENTING_COUNTER_ENTITY, "lendingRentingCount", "renting", rentingCount.toString())
    assert.assertTrue(lendingCount >= rentingCount)
}

// TODO: Nft.id on deployed subgraph does not match the one in unit test. Concerning!
export function assertNftFields(
    nftAddress: string,
    tokenId: i32,
    lentAmount: i32
): void {
    let id = nftAddress.concat("::").concat(tokenId.toString()).concat('::').concat(lentAmount.toString())
    assert.fieldEquals(NFT_ENTITY, id, "id", id)
}