import React from 'react';
import { Wheel } from 'react-custom-roulette';

const data = [
    { option: '0', style: { backgroundColor: '#FF4500', textColor: 'white' }, probability: 0.60 }, // 60% 확률
    { option: '1x', style: { backgroundColor: '#000000', textColor: 'white' }, probability: 0.20 }, // 20% 확률
    { option: '2x', style: { backgroundColor: '#FF4500', textColor: 'white' }, probability: 0.10 }, // 10% 확률
    { option: '3x', style: { backgroundColor: '#000000', textColor: 'white' }, probability: 0.05 }, // 5% 확률
    { option: '5x', style: { backgroundColor: '#FF4500', textColor: 'white' }, probability: 0.04 }, // 4% 확률
    { option: '10x', style: { backgroundColor: '#000000', textColor: 'white' }, probability: 0.01 }, // 1% 확률
];

const calculatePrizeNumber = () => {
    const random = Math.random();
    let cumulativeProbability = 0;

    for (let i = 0; i < data.length; i++) {
        cumulativeProbability += data[i].probability;
        if (random < cumulativeProbability) {
            return i;
        }
    }

    return data.length - 1; // 확률 합계가 1보다 작을 경우 마지막 인덱스를 반환
};

const Rulette = ({ mustSpin, onComplete }) => {
    const prizeNumber = mustSpin ? calculatePrizeNumber() : null;

    return (
        <div className="spinning-wheel">
            <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={data}
                backgroundColors={['#3e3e3e', '#df3428']}
                textColors={['#ffffff']}
                outerBorderColor="#ffffff"
                outerBorderWidth={10}
                innerRadius={30}
                innerBorderColor="#ffffff"
                innerBorderWidth={10}
                radiusLineColor="#ffffff"
                radiusLineWidth={5}
                fontSize={18}
                perpendicularText
                spinDuration={0.5} // Set a very short spin duration to start quickly
                onStopSpinning={() => onComplete(data[prizeNumber].option)}
            />
        </div>
    );
};

export default Rulette;
