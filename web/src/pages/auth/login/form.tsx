import { FormEventHandler } from "react";
import { UseFormRegister } from "react-hook-form";
import { LoginFormInputs } from ".";
import { Link } from "react-router-dom";

interface FormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<LoginFormInputs>;
  errors: Record<string, any>;
}

export const Form = ({ onSubmit, register, errors }: FormProps) => {
  return (
    <main className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
      <section>
        <h3 className="font-bold text-2xl">Bem vindo ao Fideli</h3>
        <p className="text-gray-600 pt-2">Compre, Ganhe, Repita!</p>
      </section>

      <section className="mt-10">
        <form className="flex flex-col" onSubmit={onSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">
            Email
          </label>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <input
              type="text"
              id="email"
              {...register("email", { required: "Email é obrigatório" })}
              className={`bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 ${errors.email
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-purple-600"
                } transition duration-500 px-3 pb-3`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">
            Senha
          </label>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <input
              type="password"
              id="password"
              {...register("pass", { required: "Senha é obrigatória" })}
              className={`bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 ${errors.password
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-purple-600"
                } transition duration-500 px-3 pb-3`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to={'/auth/register'}
              className="text-sm text-purple-600 hover:text-purple-700 hover:underline mb-6"
            >
              Não tem uma conta?
            </Link>
          </div>
          <button
            className="bg-purple hover:bg-purple-700 text-white font-bold py-2 rounded shadow-lg hover:shadow-xl transition duration-200"
            type="submit"
          >
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
};
