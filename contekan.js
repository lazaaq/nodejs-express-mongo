const { MongoClient } = require("mongodb");

const uri = 'mongodb://127.0.0.1:27017';
const dbName = 'contactapp';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

client.connect((error, client) => {
    if (error) {
        return console.log('Koneksi gagal!');
    }

    //pilih database
    const db = client.db(dbName);

    // menambahkan 1 data ke collection mahasiswa
    // db.collection('mahasiswa').insertOne(
    //     {
    //         nama: 'Dhea',
    //         email: 'dhea@gmail.com'
    //     },
    //     (error, result) => {
    //         if (error) {
    //             return console.log('gagal menambahkan data')
    //         }

    //         console.log(result);
    //     }
    // );


    //menambahkan lebih dari 1 data
    // db.collection('mahasiswa').insertMany(
    //     [
    //         {
    //             nama: 'Lana',
    //             email: 'lana@gmail.com'
    //         },
    //         {
    //             nama: 'Saiful',
    //             email: 'saiful@gmail.com'
    //         },
    //         {
    //             nama: 'Aqil',
    //             email: 'aqil@gmail.com'
    //         }
    //     ],
    //     (error, result) => {
    //         if (error) {
    //             return console.log('gagal ditambahkan!')
    //         }
    //         console.log(result);
    //     }
    // )


    // menampilkan semua data yang ada di collection 'mahasiswa'
    // console.log(db.collection('mahasiswa').find().toArray((
    //     (error, result) => {
    //         console.log(result);
    //     }
    // )));




    // menampilkan data berdasar kriteria
    // console.log(db.collection('mahasiswa').find({ nama: 'Lana' }).toArray((
    //     (error, result) => {
    //         console.log(result);
    //     }
    // )));


    
    //mengubah data
});