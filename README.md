# Template Awal Elysia

Template modern untuk API Gateway yang dibangun menggunakan Elysia.js, TypeScript, dan runtime Bun. Template ini dilengkapi dengan integrasi PostgreSQL menggunakan Drizzle ORM, caching Redis, sistem logging yang komprehensif, dan dukungan untuk deployment menggunakan Docker.

## 🚀 Teknologi yang Digunakan

- **Runtime**: [Bun](https://bun.sh/) - Runtime JavaScript yang cepat
- **Framework**: [Elysia.js](https://elysiajs.com/) - Framework web untuk Bun yang cepat dan ramah pengguna
- **Database**: [PostgreSQL](https://postgresql.org/) - Database relasional yang andal
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) - ORM berbasis TypeScript
- **Cache**: [Redis](https://redis.io/) - Penyimpanan struktur data dalam memori
- **Bahasa**: [TypeScript](https://typescriptlang.org/) - JavaScript dengan tipe yang aman
- **Containerisasi**: [Docker](https://docker.com/) - Containerisasi aplikasi

## 📋 Prasyarat

- [Bun](https://bun.sh/) >= 1.2.15
- [PostgreSQL](https://postgresql.org/) >= 12
- [Redis](https://redis.io/) >= 6
- [Docker](https://docker.com/) (opsional, untuk deployment container)

## 🛠 Instalasi

1. Clone repositori:
```bash
git clone https://github.com/irsanmansyur/elysia-starting-template.git
cd elysia-starting-template
bun install
cp .env.example .env
```
2. ⚙️ Variabel Lingkungan
	 - Buat file `.env` di direktori root dengan variabel berikut:
```dotenv
# Konfigurasi PostgreSQL
POSTGRES_URL=postgres://username:password@host:port/database

# Konfigurasi Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password
REDIS_DB=10
REDIS_CONNECT_TIMEOUT=5000
```

3. 🗄 Migrasi Database
	 - Jalankan migrasi untuk membuat skema database:
```bash
bun run drizzle-kit generate
bun run drizzle-kit migrate
```

4. Pengembangan
	 - Jalankan server dalam mode pengembangan:
```bash
bun  dev
```
Server akan berjalan dengan hot-reload dan tersedia di `http://localhost:3000`.

5. Pengujian
	 - Jalankan pengujian unit:
```bash
bun test
```

## 📦 Docker (Opsional)
Menggunakan Docker Compose (Direkomendasikan)

1. Salin file contoh docker-compose:
```bash
cp docker-compose.example.yml docker-compose.yml
```
2. Sesuaikan konfigurasi di `docker-compose.yml` sesuai kebutuhan Anda.
3. Jalankan Docker Compose:
```bash
docker-compose up -d
```

## Struktur Proyek

```
elysia-starting-template/
├── src
│   ├── database
│   ├── index.test.ts
│   ├── index.ts
│   └── routes.ts
├── tsconfig.json
├── utils
│    ├── configs
│    ├── helpers
│    ├── plugins
│    └── types
├── package.json
├── README.md
├── bun.lockb
├── docker-compose.example.yml
├── Dockerfile
└── drizzle.config.ts
```

# Fitur

### Integrasi Database
- **PostgreSQL** dengan Drizzle ORM untuk operasi database yang aman tipe
- **Pooling koneksi** dan pemeriksaan kesehatan
- **Rekoneksi otomatis** saat koneksi gagal

### Caching
- **Integrasi Redis** untuk caching performa tinggi
- **Monitoring koneksi** dengan pemulihan otomatis
- **Timeout yang dapat dikonfigurasi** dan pemilihan database

### Sistem Logging
- **Logging berbasis event** dengan metadata terstruktur
- **Penyimpanan log di database**
- **Dukungan multi-level log** (info, error, debug, dll.)

### Monitoring Kesehatan
- **Ping database** setiap 30 detik
- **Monitoring konektivitas Redis**
- **Rekoneksi otomatis** saat terjadi kegagalan

### Dokumentasi API
- **Integrasi Swagger** untuk dokumentasi API
- **Dukungan CORS** untuk permintaan lintas asal

## 🔍 Pemeriksaan Kesehatan

Aplikasi ini memiliki monitoring kesehatan bawaan:

- **Kesehatan Database**: Melakukan ping ke PostgreSQL setiap 30 detik
- **Kesehatan Redis**: Memantau konektivitas Redis dengan rekoneksi otomatis
- **Log**: Hasil pemeriksaan kesehatan dicatat ke konsol

## 🤝 Kontribusi

1. Fork repositori ini.
2. Buat branch fitur (`git checkout -b fitur/fitur-luar-biasa`).
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur luar biasa'`).
4. Push ke branch (`git push origin fitur/fitur-luar-biasa`).
5. Buka Pull Request.

## 📝 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE](LICENSE) untuk detailnya.

## 🆘 Dukungan

Jika Anda mengalami masalah atau memiliki pertanyaan:

1. Periksa halaman [Issues](../../issues).
2. Buat issue baru dengan informasi yang detail.
3. Sertakan detail lingkungan dan log error.

## 🔄 Versi

Versi saat ini: 1.0.50

---

**Dibuat dengan ❤️ menggunakan Elysia.js dan Bun
