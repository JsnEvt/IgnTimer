import { FormContainer, MinutesAmountInput, TaskInput } from './styles';
import { useFormContext } from 'react-hook-form';
import { useContext } from 'react';
import { CyclesContext } from '../../../../contexts/CyclesContext';

//react-hook-form serve para monitorar os valores do input. E a funcao register 'recria' os inputs da
//aplicacao convertendo os metodos de tal forma que possam ser tratados por ela mesma.

//para passar as regras de validacao para o zodResolver

export function NewCycleForm() {
  const { activeCycle } = useContext(CyclesContext)
  const { register } = useFormContext()

  return (
    <FormContainer>
      <label htmlFor="task">Vou trabalhar em:</label>
      <TaskInput
        id='task'
        list='task-suggestions'
        placeholder='Nome do seu projeto'
        disabled={!!activeCycle} //converte entre booleanos
        {...register('task')}

      />

      <datalist id='task-suggestions'>
        <option value="Projeto1" />
        <option value="Projeto2" />
        <option value="Projeto3" />
        <option value="Projeto4" />
      </datalist>

      <label htmlFor="">durante</label>
      <MinutesAmountInput
        type='number'
        id='minutesAmount'
        placeholder='00'
        step={5}
        min={5}
        max={60}
        disabled={!!activeCycle}
        {...register('minutesAmount', { valueAsNumber: true })}

      />

      <span>minutos</span>

    </FormContainer>

  )
}