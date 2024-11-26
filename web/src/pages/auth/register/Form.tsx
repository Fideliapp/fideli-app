import { FormEventHandler } from "react";
import { UseFormRegister } from "react-hook-form";
import { RegisterFormInputs } from ".";
import { Link } from "react-router-dom";

interface FormProps {
  onSubmit: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<RegisterFormInputs>;
  errors: Record<string, any>;
}

export const Form = ({ onSubmit, register, errors }: FormProps) => {
  return (
    <main className="bg-white max-w-lg mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
      <section>
        <h3 className="font-bold text-2xl">Junte-se a nós</h3>
        <p className="text-gray-600 pt-2">Compre, Ganhe, Repita!</p>
      </section>

      <section className="mt-10">
        <form className="flex flex-col" onSubmit={onSubmit}>
          <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">
            Nome
          </label>
          <div className="mb-6 pt-3 rounded bg-gray-200">
            <input
              type="text"
              id="nome"
              {...register("nome", { required: "Email é obrigatório" })}
              className={`bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 ${errors.email
                ? "border-red-500 focus:border-red-600"
                : "border-gray-300 focus:border-purple-600"
                } transition duration-500 px-3 pb-3`}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

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
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

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
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
          <div className="flex flex-wrap -mx-3">
            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">
                CPF
              </label>
              <div className="pt-3 rounded bg-gray-200">
                <input
                  type="text"
                  id="cpf"
                  {...register("cpf", { required: "CPF é obrigatório" })}
                  className={`bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 ${errors.cpf
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-purple-600"
                    } transition duration-500 px-3 pb-3`}
                />
              </div>
              {errors.cpf && (
                <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>
              )}
            </div>

            <div className="w-full md:w-1/2 px-3 mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2 ml-3">
                Telefone
              </label>
              <div className="pt-3 rounded bg-gray-200">
                <input
                  type="tel"
                  id="tel"
                  {...register("tel", { required: "Telefone é obrigatório" })}
                  className={`bg-gray-200 rounded w-full text-gray-700 focus:outline-none border-b-4 ${errors.tel
                    ? "border-red-500 focus:border-red-600"
                    : "border-gray-300 focus:border-purple-600"
                    } transition duration-500 px-3 pb-3`}
                />
              </div>
              {errors.tel && (
                <p className="text-red-500 text-sm mt-1">{errors.tel.message}</p>
              )}
            </div>
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
