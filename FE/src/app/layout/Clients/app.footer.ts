import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `
        <div class="min-h-screen flex flex-col justify-end">
            <footer class="w-full border-t border-surface pt-16 pb-12">
                <div class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 grid grid-cols-1 md:grid-cols-5 gap-8 mb-16">
                    <div class="space-y-5">
                        <div class="flex items-center gap-3">
                            <i class="fa-solid fa-house-chimney text-primary text-3xl"></i>
                            <span class="text-2xl font-bold tracking-tight dark:text-white uppercase">HOMESHOP</span>
                        </div>
                        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-[240px]">Tầng 4, Tòa nhà số 97 - 99 Láng Hạ, Đống Đa, Hà Nội (Tòa nhà Petrowaco)</p>
                        <div class="flex gap-3 pt-2">
                            <a class="w-9 h-9 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400 hover:bg-primary hover:text-white transition-colors" href="#">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3l-.5 3H13v6.8c4.56-.93 8-4.96 8-9.8z"></path>
                                </svg>
                            </a>
                            <a class="w-9 h-9 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400 hover:bg-primary hover:text-white transition-colors" href="#">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path
                                        d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.48.75 2.78 1.9 3.55-.7 0-1.35-.2-1.94-.53v.05c0 2.07 1.47 3.8 3.44 4.19-.36.1-.74.15-1.13.15-.28 0-.55-.03-.81-.08.54 1.7 2.12 2.93 4 2.97-1.47 1.15-3.32 1.84-5.33 1.84-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.59 1.93 7.91 0 12.23-6.55 12.23-12.23 0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"
                                    ></path>
                                </svg>
                            </a>
                            <a class="w-9 h-9 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400 hover:bg-primary hover:text-white transition-colors" href="#">
                                <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"
                                    ></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                    <div class="space-y-5">
                        <h3 class="font-bold  dark:text-white uppercase tracking-wider text-sm">Bạn cần hỗ trợ?</h3>
                        <div class="space-y-4">
                            <a class="flex flex-col group" href="tel:0901191616">
                                <p class="text-xl font-bold text-primary">0901.191.616</p>
                                <p class="text-[12px] text-slate-500 dark:text-slate-400">Thứ 2 - Thứ 6: 9:00 - 20:00</p>
                            </a>
                            <a class="flex items-center gap-3 text-surface-500 dark:text-surface-400 hover:text-primary transition-colors" href="mailto:[EMAIL_ADDRESS]">
                                <i class="fa-solid fa-envelope text-lg"></i>
                                <span class="text-sm">[EMAIL_ADDRESS]</span>
                            </a>
                        </div>
                    </div>
                    <div class="space-y-5">
                        <h3 class="font-bold  dark:text-white uppercase tracking-wider text-sm">Về chúng tôi</h3>
                        <nav class="flex flex-col gap-2.5">
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Về chúng tôi</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Sản phẩm</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Tin khuyến mại</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Kiến thức</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Tuyển dụng</a>
                        </nav>
                    </div>
                    <div class="space-y-5">
                        <h3 class="font-bold  dark:text-white uppercase tracking-wider text-sm">Liên kết</h3>
                        <nav class="flex flex-col gap-2.5">
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Điều hòa không khí</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Gia dụng thông minh</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Thiết bị nghe nhìn</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Hệ thống giám sát</a>
                        </nav>
                    </div>
                    <div class="space-y-5">
                        <h3 class="font-bold  dark:text-white uppercase tracking-wider text-sm">Chăm sóc khách hàng</h3>
                        <nav class="flex flex-col gap-2.5">
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Tài khoản</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Dịch vụ khách hàng</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Trả lại/Đổi hàng</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Hỗ trợ sản phẩm</a>
                            <a class="text-sm text-slate-500 dark:text-slate-400 hover:text-primary transition-colors" href="#">Câu hỏi thường gặp</a>
                        </nav>
                    </div>
                </div>
                <div class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 border-y border-surface text-center space-y-8">
                    <h2 class="text-xl md:text-2xl font-bold dark:text-white leading-tight">Đăng ký nhận bản tin để nhận giảm giá 10% cho đơn hàng tiếp theo!</h2>
                    <div class="relative max-w-lg mx-auto">
                        <input class="w-full h-14 pl-8 pr-28 rounded-full border border-surface bg-surface-0 dark:bg-surface-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm transition-all shadow-sm" placeholder="Địa chỉ email của bạn..." type="email" />
                        <button class="absolute right-1.5 top-1.5 bottom-1.5 px-7 rounded-full bg-primary text-white font-bold text-xs tracking-widest transition-all hover:bg-blue-600 hover:shadow-md active:scale-95 uppercase">Gửi ngay</button>
                    </div>
                </div>
                <div class="py-6 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 mt-10 flex flex-row justify-between items-center gap-4 text-[10px] sm:text-xs">
                    <p class="text-slate-400 dark:text-slate-500 font-medium shrink-0">© 2024 Web4s. All rights reserved.</p>
                    <div class="flex flex-wrap justify-end gap-2 sm:gap-4">
                        <img alt="Visa" class="h-4 sm:h-5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDl3_SR3-WS2sRNYGFImAu0hfZzNITBV1HP8uFfomZo0ku-WWPhx0EeUvBJAvJ2v2RReueKI4HG9tQWTABm879P6ubYSL77ZgbZihjN2JGAlqywJ2ncjEfAPwBgbR18I1v0idwSmIy-HCVaVqBkfjrkYLIJfZGJy4M8W_IxxM-KO5GwM00Lt5-76v2EhhNPwMxMByb5GIzyc8hhkIGAe8kbwA412Ns1B_R8uPDyA0rTYu4hNQDsNdPAO9g0AxIYIf7KeBgSs0KHQBk" />
                        <img alt="Mastercard" class="h-4 sm:h-5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkWsNmhq2r8y2ynQYEiKy5KXT_QEWGFoVytHcTSZqQIp9LaM4PqQXrm4JwrmPonAygp6uWsPhR48UkSyfxs0xaSiLmegsS1URNOUxTdbGAujZ22UB89_jg_i518GaZEFiNgO1pAMO3w-x4Ek48qN7tHtB90ZWqbHdL9pco4tR-YVixWhDuT2yCmSGX0n1muCDgw-eliZsyyeKLrSOFhymtYLV72ySvCgaqJIX7-SQwMxduQScR1F6o8PmXxgSuwlnYTornmf9WJJk" />
                        <img alt="PayPal" class="h-4 sm:h-5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGgYJzpryl94xzFcYajsDiXXEQosYpTQwOf6EYic6PGZ3pkmI8F3Pw4vsbl0mNoBeAL-snjtrZitZkcez6bIpb4ZGV6HcRQJNzPj1nVTma83QdyrqWzqvztlu_1lm4G3RT4395dHglKdAtu16wZ8LyBxE-Lbo5-VStHP6ZD5UjgYYU1hTchptHv-p08V_xWDE6r3T3MgTKXl0yfyMvgv8uX0tx0OcKzHXmJtITTfISeHue7QiiHtTwP0IjKIqovqp1BSZX2yXDM-8" />
                    </div>
                </div>
            </footer>
            <div class="fixed bottom-6 left-6 flex flex-col gap-3 z-50">
                <button class="flex items-center gap-3 bg-[#0084FF] text-white px-5 py-3 rounded-full shadow-xl transition-all hover:translate-x-1 active:scale-95">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M12 2C6.477 2 2 6.145 2 11.258c0 2.908 1.462 5.503 3.746 7.231.197.149.32.373.33.616l.034 2.13c.01.65.65 1.12 1.25.86l2.408-.996a.913.913 0 01.666.027c1.13.487 2.378.76 3.682.76 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2z"
                        ></path>
                    </svg>
                    <span class="text-sm font-semibold pr-1">Tư vấn qua Zalo</span>
                </button>
                <button class="flex items-center gap-3 bg-[#1877F2] text-white px-5 py-3 rounded-full shadow-xl transition-all hover:translate-x-1 active:scale-95">
                    <svg class="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                        ></path>
                    </svg>
                    <span class="text-sm font-semibold pr-1">Facebook Chat</span>
                </button>
                <button class="flex items-center gap-3 bg-surface-900 dark:bg-surface-700 text-white px-5 py-3 rounded-full shadow-xl transition-all hover:translate-x-1 active:scale-95 border border-white/10">
                    <i class="fa-solid fa-headset text-primary text-lg"></i>
                    <span class="text-sm font-semibold pr-1">Hotline 0901.191.616</span>
                </button>
            </div>
        </div>`
})
export class AppFooter { }
