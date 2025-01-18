"use client"

import * as Clerk from '@clerk/elements/common'
import * as SignIn from '@clerk/elements/sign-in'

const LoginPage = () => {
    return (
        <div className=''>
            <SignIn.Root>
                <SignIn.Step
                    name="start"
                    className=""
                >
                    <h1> ERP CD</h1>
                    <h1> Ingresa con tu nombre de usuario</h1>

                    <Clerk.GlobalError />
                    <Clerk.Field name="identifier">
                        <Clerk.Label>Nombre de Usuario</Clerk.Label>
                        <Clerk.Input type="text" required />
                        <Clerk.FieldError />
                    </Clerk.Field>
                    <Clerk.Field name="password">
                        <Clerk.Label>Contraseña</Clerk.Label>
                        <Clerk.Input type="password" required />
                        <Clerk.FieldError />
                    </Clerk.Field>
                    <SignIn.Action submit>Ingresar</SignIn.Action>
                </SignIn.Step>
            </SignIn.Root>
        </div>
    );
};

export default LoginPage;