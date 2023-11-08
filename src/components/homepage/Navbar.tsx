import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { UserButton, useSession } from "@clerk/nextjs";
import Link from "next/link";
import logo from "../../../public/tractivitylogo.png";
import Image from "next/image";

// function classNames(...classes: string[]) {
//   return classes.filter(Boolean).join(" ");
// }

export default function Navbar() {
 const session = useSession()

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto  max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 justify-between">
              <div className="absolute inset-y-0  left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:hidden">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="invisible items-center  justify-center sm:visible sm:flex  sm:items-stretch sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  {/* PLACEHOLDER IMAGE */}
                  <Image
                    className="h-10 w-auto"
                    src={logo}
                    alt="Tractivity logo"
                  />
                </div>
                <div className=" sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                  <Link
                    href="/"
                    className="inline-flex items-center border-b-2 border-white px-1 pt-1 text-sm font-medium text-gray-900 hover:border-indigo-500"
                  >
                    Home
                  </Link>
                  {session.isSignedIn && <Link
                    href="/dashboard"
                    className="inline-flex items-center border-b-2 border-white px-1 pt-1 text-sm font-medium text-gray-900 hover:border-indigo-500"
                  >
                    Dashboard
                  </Link>}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                      <UserButton />
                    </Menu.Button>
                  </div>
                  {/* <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition> */}
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pb-4 pt-2">
              {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700" */}
              <Image
                className="h-10  w-auto"
                src={logo}
                alt="Tractivity logo"
              />
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 border-b border-white hover:border-b-indigo-500 hover:bg-gray-50 hover:text-gray-700 "
              >
                Home
              </Disclosure.Button>
              {session.isSignedIn && <Disclosure.Button
                as="a"
                href="/dashboard"
                className="block border-l-4 border-transparent py-2 pl-3 pr-4 text-base font-medium text-gray-500 border-b border-white hover:border-b-indigo-500 hover:bg-gray-50 hover:text-gray-700 "
              >
                Dashboard
              </Disclosure.Button>}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
