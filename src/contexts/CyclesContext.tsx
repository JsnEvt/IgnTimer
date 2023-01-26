import { differenceInSeconds } from 'date-fns';
import { createContext, ReactNode, useEffect, useReducer, useState } from 'react';
import { addNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from '../reducers/cycles/actions';
import { Cycle, cyclesReducer } from '../reducers/reducer'

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}



export interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
}

export const CyclesContext = createContext({} as CyclesContextType)

interface CycleContextProviderProps {
  children: ReactNode
}


export function CyclesContextProvider({ children }: CycleContextProviderProps) {

  const [cyclesState, dispatch] = useReducer(cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    }, () => {
      const storedStateAsJSON = localStorage.getItem('@jstimer:cycles-state-1.0.0')
      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }
      return {
        cycles: [],
        activeCycleId: null
      }
    })


  const { activeCycleId, cycles } = cyclesState;
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)


  const [amountSecondsPassed, setAmountSecondPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(
        new Date(),
        new Date(activeCycle.startDate)
      )
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@jstimer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])


  function setSecondsPassed(seconds: number) {
    setAmountSecondPassed(seconds)
  }

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }
  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime())

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    setAmountSecondPassed(0)

  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction())
  }
  return (
    <CyclesContext.Provider value={{
      cycles,
      activeCycle,
      activeCycleId,
      amountSecondsPassed,
      markCurrentCycleAsFinished,
      setSecondsPassed,
      createNewCycle,
      interruptCurrentCycle
    }}
    >
      {children}
    </CyclesContext.Provider>
  )
}