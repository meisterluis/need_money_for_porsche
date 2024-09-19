/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 ..\public\models\mobilePhone4.glb 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/mobilePhone4.glb')
  return (
    <group {...props} dispose={null}>
      <group position={[-0.003, 0.27, -0.097]} rotation={[Math.PI / 2, 0, Math.PI]} scale={[0.71, 1, 0.69]}>
        <mesh geometry={nodes['Unbenannt-1'].geometry} material={materials['Unbenannt-1']} />
        <mesh geometry={nodes['Unbenannt-1_1'].geometry} material={materials['mat16.002']} />
        <mesh geometry={nodes['Unbenannt-1_2'].geometry} material={materials['mat23.002']} />
        <mesh geometry={nodes['Unbenannt-1_3'].geometry} material={materials['mat17.002']} />
        <mesh geometry={nodes['Unbenannt-1_4'].geometry} material={materials['mat8.002']} />
        <mesh geometry={nodes['Unbenannt-1_5'].geometry} material={materials['mat24.002']} />
        <mesh geometry={nodes['Unbenannt-1_6'].geometry} material={materials['mat25.002']} />
        <mesh geometry={nodes['Unbenannt-1_7'].geometry} material={materials['mat5.002']} />
        <mesh geometry={nodes['Unbenannt-1_8'].geometry} material={materials['mat15.002']} />
        <mesh geometry={nodes['Unbenannt-1_9'].geometry} material={materials['donate-now-button-rounded-red-sign-vector-27110689']} />
      </group>
    </group>
  )
}

useGLTF.preload('/mobilePhone4.glb')