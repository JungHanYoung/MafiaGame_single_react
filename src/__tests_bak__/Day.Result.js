import React from 'react'
import { shallow, mount } from "enzyme";
import { List, Map } from 'immutable'

import Result from '../components/DayTime/Result'
import { JOB_NAME_OF_CITIZEN, JOB_NAME_OF_MAFIA, JOB_NAME_OF_DOCTOR, JOB_NAME_OF_POLICE } from '../contants/Job';
import { players } from '../mockData'
import sinon from 'sinon'

const minProps = {
    players,
    changeDayTimeOrder: jest.fn(),
    deletePlayer: jest.fn(),
    moveToResult: jest.fn(),
    moveRevote: jest.fn()
}

const playersWithMafiaVictory = List([
    Map({
        name: "대용",
        jobName: JOB_NAME_OF_MAFIA,
        daytimeVoted: 1
    }),
    Map({
        name: "한영",
        jobName: JOB_NAME_OF_CITIZEN,
        daytimeVoted: 0
    }),
    Map({
        name: "미린",
        jobName: JOB_NAME_OF_MAFIA,
        daytimeVoted: 0
    }),
    Map({
        name: "대랑",
        jobName: JOB_NAME_OF_POLICE,
        daytimeVoted: 0
    }),
    Map({
        name: "대미",
        jobName: JOB_NAME_OF_DOCTOR,
        daytimeVoted: 4
    })
])
const playersWithCitizenVictory = List([
    Map({
        name: "대용",
        jobName: JOB_NAME_OF_MAFIA,
        daytimeVoted: 3
    }),
    Map({
        name: "한영",
        jobName: JOB_NAME_OF_CITIZEN,
        daytimeVoted: 0
    }),
    Map({
        name: "대랑",
        jobName: JOB_NAME_OF_POLICE,
        daytimeVoted: 0
    }),
    Map({
        name: "대미",
        jobName: JOB_NAME_OF_DOCTOR,
        daytimeVoted: 1
    })
])



const sameRatePlayers = List([
    Map({
        name: "대용",
        jobName: JOB_NAME_OF_MAFIA,
        daytimeVoted: 0
    }),
    Map({
        name: "한영",
        jobName: JOB_NAME_OF_CITIZEN,
        daytimeVoted: 2
    }),
    Map({
        name: "미린",
        jobName: JOB_NAME_OF_DOCTOR,
        daytimeVoted: 2
    }),
    Map({
        name: "대랑",
        jobName: JOB_NAME_OF_POLICE,
        daytimeVoted: 0
    }),
])

describe('<Result /> 컴포넌트', () => {
    let wrapper = mount(<Result {...minProps} />);

    it('props 받기', () => {
        // props > players 가 잘 받아지는가. (플레이어 4명)
        const playersProp = wrapper.prop('players')
        expect(playersProp.size).toEqual(4)
    })
    it('기본 props에 대한 렌더링 테스트', () => {

        const descriptionBox = wrapper.find('p.content-description')
        const buttonBox = wrapper.find('button.btn-lg');

        expect(descriptionBox.text()).toEqual('한영 님이 죽으셨습니다.')
        expect(descriptionBox.exists()).toEqual(true)
        expect(buttonBox.exists()).toEqual(true)
        expect(buttonBox.text()).toEqual('밤이 됩니다.')

    })

    it('동률의 투표가 발생했을 경우의 렌더링 테스트', () => {
        const deletePlayer = sinon.spy()
        const moveRevote = sinon.spy()
        // players props에 동률 투표의 상태를 적용
        wrapper = shallow(<Result {...minProps}
            players={sameRatePlayers}
            deletePlayer={deletePlayer}
            moveRevote={moveRevote} />)

        const descriptionBox = wrapper.find('p.content-description')
        expect(descriptionBox.exists()).toEqual(true)
        // '투표가 동률이 났습니다.'라는 텍스트가 출력되는지 확인
        expect(descriptionBox.text()).toEqual('투표가 동률이 났습니다.')

        const buttonWrapper = wrapper.find('button.btn-lg')
        expect(buttonWrapper).toHaveLength(2)

        const revoteBtn = buttonWrapper.at(0)
        const setNightBtn = buttonWrapper.at(1)

        setNightBtn.simulate('click')

        expect(deletePlayer.calledOnce).toEqual(false)

        revoteBtn.simulate('click')

        expect(moveRevote.calledOnce).toEqual(true)
    })

})

describe('마피아 승리 조건일때 테스트', () => {
    const moveToResult = sinon.spy()
    const wrapper = shallow(<Result {...minProps} players={playersWithMafiaVictory} moveToResult={moveToResult} />)

    it('마피아 승리 메세지 출력', () => {
        const victoryMessage = wrapper.find('h3')

        expect(victoryMessage.exists()).toEqual(true)
    })

    it('click 이벤트에 대한 메소드 호출', () => {
        const button = wrapper.find('button.btn-lg');
        button.simulate('click')
        expect(moveToResult.callCount).toBe(1)
    })
})

describe('시민 승리 조건일때 테스트', () => {
    const moveToResult = sinon.spy()
    const wrapper = shallow(<Result {...minProps} players={playersWithCitizenVictory} moveToResult={moveToResult} />)

    it('시민 승리 메세지 출력', () => {
        const message = wrapper.find('h3')
        expect(message.text()).toBe('시민이 승리하였습니다.')
    })

    it('버튼 클릭 이벤트에 대한 메소드 호출', () => {
        const button = wrapper.find('button.btn-lg');
        button.simulate('click')
        expect(moveToResult.callCount).toBe(1)
    })
})