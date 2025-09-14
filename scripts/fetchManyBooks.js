import mongoose from 'mongoose';
import axios from 'axios';
import Book from '../models/Book.js';
import dotenv from 'dotenv';
dotenv.config();

const CONNECTION_URI = process.env.CONNECTION_URI;
const TOTAL_RESULTS_PER_CATEGORY = 600; // how many books you want per category
const MAX_RESULTS_PER_REQUEST = 40; // API limit per request

// List of queries / categories
const categories = [
    { name: 'Harry Potter', query: 'harry+potter' },
    { name: 'Lord of the Rings', query: 'lord+of+the+rings' },
    { name: 'Game of Thrones', query: 'game+of+thrones' },
    // { name: 'Sherlock Holmes', query: 'sherlock+holmes' },
    // { name: 'Percy Jackson', query: 'percy+jackson' },
    // { name: 'Hunger Games', query: 'hunger+games' },
    // { name: 'Twilight', query: 'twilight' },
    // { name: 'Dune', query: 'dune' },
    // { name: 'Foundation', query: 'foundation+isaac+asimov' },
    // { name: 'The Wheel of Time', query: 'wheel+of+time' },
    // { name: 'A Song of Ice and Fire', query: 'a+song+of+ice+and+fire' },
    // { name: 'The Chronicles of Narnia', query: 'chronicles+of+narnia' },
    // { name: 'Ender’s Game', query: 'enders+game' },
    // { name: 'The Martian', query: 'the+martian+andy+weir' },
    // { name: 'Mistborn', query: 'mistborn' },
    // { name: 'The Hobbit', query: 'the+hobbit' },
    // { name: 'His Dark Materials', query: 'his+dark+materials' },
    // { name: 'The Witcher', query: 'the+witcher' },
    // { name: 'American Gods', query: 'american+gods' },
    // { name: 'The Expanse', query: 'the+expanse' },
    // { name: 'Divergent', query: 'divergent' },
    // { name: 'Shadow and Bone', query: 'shadow+and+bone' },
    // { name: 'Red Rising', query: 'red+rising' },
    // { name: 'The Dark Tower', query: 'dark+tower' },
    // { name: 'The Maze Runner', query: 'maze+runner' },
    // { name: 'The Inheritance Cycle', query: 'inheritance+cycle' },
    // { name: 'Heroes of Olympus', query: 'heroes+of+olympus' },
    // { name: 'Artemis Fowl', query: 'artemis+fowl' },
    // { name: 'The Mortal Instruments', query: 'mortal+instruments' },
    // { name: 'City of Bones', query: 'city+of+bones' },
    // { name: 'Shadowhunter Chronicles', query: 'shadowhunter+chronicles' },
    // { name: 'The Selection', query: 'the+selection+book+series' },
    // { name: 'Lunar Chronicles', query: 'lunar+chronicles' },
    // { name: 'Throne of Glass', query: 'throne+of+glass' },
    // { name: 'Catching Fire', query: 'catching+fire' },
    // { name: 'Mockingjay', query: 'mockingjay' },
    // { name: 'The Giver', query: 'the+giver' },
    // { name: 'The Book Thief', query: 'the+book+thief' },
    // { name: 'Chronicles of Prydain', query: 'chronicles+of+prydain' },
    // { name: 'Darkest Minds', query: 'darkest+minds' },
    // { name: 'The 5th Wave', query: '5th+wave' },
    // { name: 'Beautiful Creatures', query: 'beautiful+creatures' },
    // { name: 'Maximum Ride', query: 'maximum+ride' },
    // { name: 'Septimus Heap', query: 'septimus+heap' },
    // { name: 'Red Queen', query: 'red+queen+series' },
    // { name: 'Eragon', query: 'eragon' },
    // { name: 'The Magicians', query: 'the+magicians' },
    // { name: 'Grisha Trilogy', query: 'grisha+trilogy' },
    // { name: 'Bloodlines', query: 'bloodlines+series' },
    // { name: 'Pillars of the Earth', query: 'pillars+of+the+earth' },
    // { name: 'Outlander', query: 'outlander' },
    // { name: 'The Nightingale', query: 'the+nightingale' },
    // {
    //     name: 'All the Light We Cannot See',
    //     query: 'all+the+light+we+cannot+see'
    // },
    // { name: 'The Alchemist', query: 'the+alchemist' },
    // { name: 'Sapiens', query: 'sapiens' },
    // { name: 'Homo Deus', query: 'homo+deus' },
    // { name: 'Educated', query: 'educated' },
    // { name: 'Becoming', query: 'becoming+michele+obama' },
    // { name: 'Thinking, Fast and Slow', query: 'thinking+fast+and+slow' },
    // { name: 'Atomic Habits', query: 'atomic+habits' },
    // { name: 'The Power of Habit', query: 'power+of+habit' },
    // {
    //     name: 'The Subtle Art of Not Giving a F*ck',
    //     query: 'subtle+art+of+not+giving+a+fuck'
    // },
    // { name: 'Rich Dad Poor Dad', query: 'rich+dad+poor+dad' },
    // { name: 'The Intelligent Investor', query: 'intelligent+investor' },
    // { name: 'Meditations', query: 'meditations+marcus+aurelius' },
    // { name: 'The Art of War', query: 'art+of+war' },
    // { name: 'The Catcher in the Rye', query: 'catcher+in+the+rye' },
    // { name: 'To Kill a Mockingbird', query: 'to+kill+a+mockingbird' },
    // { name: '1984', query: '1984+george+orwell' },
    // { name: 'Brave New World', query: 'brave+new+world' },
    // { name: 'Fahrenheit 451', query: 'fahrenheit+451' },
    // { name: 'Animal Farm', query: 'animal+farm' },
    // { name: 'The Great Gatsby', query: 'the+great+gatsby' },
    // { name: 'Moby Dick', query: 'moby+dick' },
    // { name: 'Pride and Prejudice', query: 'pride+and+prejudice' },
    // { name: 'Jane Eyre', query: 'jane+eyre' },
    // { name: 'Wuthering Heights', query: 'wuthering+heights' },
    // { name: 'The Odyssey', query: 'the+odyssey' },
    // { name: 'The Iliad', query: 'the+iliad' },
    // { name: 'Crime and Punishment', query: 'crime+and+punishment' },
    // { name: 'War and Peace', query: 'war+and+peace' },
    // { name: 'The Brothers Karamazov', query: 'brothers+karamazov' },
    // { name: 'Les Misérables', query: 'les+miserables' },
    // { name: 'Anna Karenina', query: 'anna+karenina' },
    // { name: 'Dracula', query: 'dracula' },
    // { name: 'Frankenstein', query: 'frankenstein' },
    // { name: 'The Shining', query: 'the+shining' },
    // { name: 'It', query: 'it+stephen+king' },
    // { name: 'Carrie', query: 'carrie+stephen+king' },
    // { name: 'Pet Sematary', query: 'pet+sematary' },
    // { name: 'It Ends With Us', query: 'it+ends+with+us' },
    // { name: 'Verity', query: 'verity' },
    // { name: 'Where the Crawdads Sing', query: 'where+the+crawdads+sing' },
    // { name: 'Little Women', query: 'little+women' },
    // { name: 'The Secret Garden', query: 'secret+garden' },
    // { name: 'Alice in Wonderland', query: 'alice+in+wonderland' },
    // { name: 'Winnie the Pooh', query: 'winnie+the+pooh' },
    // { name: 'Charlotte’s Web', query: 'charlottes+web' },
    // { name: 'The Tale of Peter Rabbit', query: 'peter+rabbit' }
];

async function fetchAndStoreBooks(query, category) {
    try {
        for (
            let startIndex = 0;
            startIndex < TOTAL_RESULTS_PER_CATEGORY;
            startIndex += MAX_RESULTS_PER_REQUEST
        ) {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${MAX_RESULTS_PER_REQUEST}&startIndex=${startIndex}`;
            const response = await axios.get(url);

            const books = response.data.items || [];
            if (books.length === 0) break; // no more books

            for (const book of books) {
                const info = book.volumeInfo;
                const isbn =
                    info.industryIdentifiers?.find(
                        (id) => id.type === 'ISBN_13'
                    )?.identifier ||
                    info.industryIdentifiers?.[0]?.identifier ||
                    null;

                await Book.updateOne(
                    { google_id: book.id },
                    {
                        google_id: book.id,
                        title: info.title || 'Untitled',
                        author: info.authors
                            ? info.authors.join(', ')
                            : 'Unknown',
                        publisher: info.publisher || null,
                        published_date: info.publishedDate || null,
                        description: info.description || null,
                        thumbnail_url: info.imageLinks?.thumbnail || null,
                        isbn,
                        category // save category
                    },
                    { upsert: true }
                );
            }

            console.log(
                `Fetched ${books.length} books for "${category}" (startIndex: ${startIndex})`
            );
        }

        console.log(
            `✅ All books for category "${category}" inserted successfully!`
        );
    } catch (err) {
        console.error(`Error fetching books for "${category}":`, err.message);
    }
}

async function main() {
    await mongoose.connect(CONNECTION_URI);
    console.log('Connected to MongoDB');

    for (const cat of categories) {
        await fetchAndStoreBooks(cat.query, cat.name);
    }

    mongoose.connection.close();
    console.log('MongoDB connection closed');
}

main();

//node scripts/fetchManyBooks.js
