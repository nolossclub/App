<template>
  <section>
    <div class="container px-4 mx-auto">
      <nav class="flex justify-between items-center py-6">
        <a class="text-xl font-bold leading-none text-blue-600" href="#">No Loss Club</a>
        <div class="lg:block">
          <div class="order-first lg:order-last -mx-2 mb-4 lg:mb-0">
            <a class="inline-block mx-2 px-1 w-10" href="#">
              <img src="../assets/social/discord.png" alt="" />
            </a>
            <a class="inline-block mx-2 px-1 w-10" href="#">
              <img src="../assets/social/medium.png" alt="" />
            </a>
            <a class="inline-block mx-2 px-1 w-10" href="#">
              <img src="../assets/social/telegram.png" alt="" />
            </a>
          </div>
        </div>
      </nav>
      <div class="py-40">
        <div class="text-center">
          <h2 class="md:px-24 title text-4xl md:text-5xl mb-4 font-bold font-heading">
            <span>Earn crypto by </span>
            <span class="text-blue-600">playing safe </span>
          </h2>
          <p class="text-blueGray-400 leading-relaxed text-xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus
            eget justo et iaculis.
          </p>
        </div>
        <div class="mt-8 text-center">
          <a
            class="block sm:inline-block py-4 px-8 mb-4 sm:mb-0 sm:mr-3 text-md text-white text-center font-semibold leading-none bg-blue-600 hover:bg-blue-700 rounded"
            href="#"
            >Go to App</a
          ><a
            class="block sm:inline-block py-4 px-8 text-md text-blueGray-500 hover:text-blueGray-600 text-center font-semibold leading-none bg-white border border-blueGray-200 hover:border-blueGray-300 rounded"
            href="#"
            >Community</a
          >
        </div>
      </div>
    </div>
    <div
      class="hidden navbar-menu fixed top-0 left-0 bottom-0 w-5/6 max-w-sm z-50"
    >
      <div
        class="navbar-backdrop fixed inset-0 bg-blueGray-800 opacity-25"
      ></div>
      <nav
        class="relative flex flex-col py-6 px-6 w-full h-full bg-white border-r overflow-y-auto"
      >
        <div class="flex items-center mb-8">
          <a class="mr-auto text-3xl font-semibold leading-none" href="#">
            <img
              class="h-10"
              src="metis-assets/logos/metis/metis.svg"
              alt=""
              width="auto"
          /></a>
          <button class="navbar-close">
            <svg
              class="h-6 w-6 text-blueGray-400 cursor-pointer hover:text-blueGray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewbox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div>
          <ul>
            <li class="mb-1">
              <a
                class="block p-4 text-sm text-blueGray-500 hover:bg-blue-50 hover:text-blue-600"
                href="#"
                >Product</a
              >
            </li>
            <li class="mb-1">
              <a
                class="block p-4 text-sm text-blueGray-500 hover:bg-blue-50 hover:text-blue-600"
                href="#"
                >Company</a
              >
            </li>
            <li class="mb-1">
              <a
                class="block p-4 text-sm text-blueGray-500 hover:bg-blue-50 hover:text-blue-600"
                href="#"
                >About Us</a
              >
            </li>
            <li class="mb-1">
              <a
                class="block p-4 text-sm text-blueGray-500 hover:bg-blue-50 hover:text-blue-600"
                href="#"
                >Features</a
              >
            </li>
          </ul>
          <div class="mt-4 pt-6 border-t border-blueGray-100">
            <a
              class="block px-4 py-3 mb-3 text-xs text-center font-semibold leading-none bg-blue-600 hover:bg-blue-700 text-white rounded"
              href="#"
              >Sign Up</a
            ><a
              class="block px-4 py-3 mb-2 text-xs text-center text-blue-600 hover:text-blue-700 font-semibold leading-none border border-blue-200 hover:border-blue-300 rounded"
              href="#"
              >Log In</a
            >
          </div>
        </div>
        <div class="mt-auto">
          <p class="my-4 text-xs text-blueGray-400">
            <span>Get in Touch</span>
            <a class="text-blue-600 hover:text-blue-600 underline" href="#"
              >info@example.com</a
            >
          </p>
          <a class="inline-block px-1" href="#">
            <img src="metis-assets/icons/facebook-blue.svg" alt=""
          /></a>
          <a class="inline-block px-1" href="#">
            <img src="metis-assets/icons/twitter-blue.svg" alt=""
          /></a>
          <a class="inline-block px-1" href="#">
            <img src="metis-assets/icons/instagram-blue.svg" alt=""
          /></a>
        </div>
      </nav>
    </div>
  </section>
</template>
