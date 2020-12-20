// const { src, dest, watch } = require('gulp');
// const gzip = require('gulp-gzip')
// const replace = require('gulp-replace')
// const merge = require('merge-stream');
// const s3 = require('gulp-s3-upload')(
//     {useIAM:true},  // or {} / null
//     { /* S3 Config */ }
// );
// const { S3 } = require('aws-sdk');
// const { upload, clean } = require('gulp-s3-publish');
// const liveServer = require('live-server')

// const client = new S3();

// const uploadOpts = {
//     bucket: 'ita-proy-prod-chatbot-sgs-itv-webchat',
//     uploadPath: 'pre',
//     // delay: 0,
//     // maxConcurrency: 1,
//     putObjectParams: {
//       ACL: 'public-read'
//     },
//     // dryRun: false,
//   };

// function deployPre() {
//     uploadOpts.uploadPath = 'pre'
//     return build('pre')
//         .pipe(upload(client, uploadOpts))
// }

// function deployPro() {
//     uploadOpts.uploadPath = 'pro'
//     return build('pro')
//         .pipe(upload(client, uploadOpts))
// }

// function build(env) {
//     if (process.env.npm_package_config_BUCKET_URL === 'PLACE HERE YOUR S3 BUCKET URL') {
//         console.log('Please, fill BUCKET_URL property in package.json')
//         return -1
//     }

//     console.log('accountSid: ' + process.env['npm_package_config_' + env + '_accountSid'])
//     console.log('flexFlowSid: ' + process.env['npm_package_config_' + env + '_flexFlowSid'])

//     return src('src/**')
//             .pipe(replace('${ACCOUNT_SID}', process.env['npm_package_config_' + env + '_accountSid']))
//             .pipe(replace('${FLEX_FLOW_SID}', process.env['npm_package_config_' + env + '_flexFlowSid']))
//             .pipe(dest('./dist', {overwrite: true}))
//             // .pipe(upload(client, uploadOpts))
// }

// // function deploy() {
// //     if (process.env.npm_package_config_BUCKET_URL === 'PLACE HERE YOUR S3 BUCKET URL') {
// //         console.log('Please, fill BUCKET_URL property in package.json')
// //         return -1
// //     }

// //     return src('src/**')
// //             // .pipe(gzip())
// //             // .pipe(dest('./dist', {overwrite: true}))
// //             .pipe(upload(client, uploadOpts))
// //             // .pipe(s3({
// //             //     Bucket: process.env.npm_package_config_BUCKET_URL,
// //             //     ACL: 'public-read'
// //             // }))

// //             // .pipe(s3)
// // }

// function dev() {
//     const dist = build('dev')
//         .pipe(dest('./build', {overwrite: true}))

//     const html = src('www/index.html')
//         .pipe(replace('${JS_FILE_PATH}', 'assets/js'))
//         .pipe(dest('./build', {overwrite: true}))

//     return merge(dist, html)
// }

// ////////////////////////
// // ONLY CALL FROM NPM!!!!
// ////////////////////////
// function pro() {
//     console.log(`process.env.config.BUCKET_URL ${process.env.npm_package_config_BUCKET_URL}`)
//     if (process.env.npm_package_config_BUCKET_URL === 'PLACE HERE YOUR S3 BUCKET URL') {
//         console.log('Please, fill BUCKET_URL property in package.json')
//         return -1
//     }

//     const js = src('src/*.js')
//         .pipe(dest('./build/js', {overwrite: true}))

//     const html = src('www/index.html')
//         .pipe(replace('${JS_FILE_PATH}', process.env.npm_package_config_BUCKET_URL))
//         .pipe(dest('./build', {overwrite: true}))

//     return merge(js, html)
// }

// function devWatch() {
//     dev()
//     const options = {
//         port: 8181,
//         root: './build'
//     }

//     liveServer.start(options)

//     watch(['src/**', 'www/*'], function(cb) {
//         doWatch()
//     })
// }

// function doWatch() {
//     dev()

//     watch(['src/**', 'www/*'], function(cb) {
//         doWatch()
//     })
// }


// exports.dev = dev
// exports.pro = pro
// exports.deployPre = deployPre
// exports.deployPro = deployPro
// exports.devWatch = devWatch

var watchify = require('watchify');
var browserify = require('browserify');
var gulp = require('gulp');
const { src, dest, watch } = require('gulp');
const merge = require('merge-stream');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var log = require('gulplog');
var sourcemaps = require('gulp-sourcemaps');
var assign = require('lodash.assign');

// add custom browserify options here
var customOpts = {
  entries: ['./src/web.js'],
  debug: true,
  standalone: 'Game',
  output: 'tmp/bundle.js'
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));


gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', log.info); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', log.error.bind(log, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
       // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}


function liveDev() {
    // const js = src('src/*.js')
    //     .pipe(dest('./build/js', {overwrite: true}))
    const html = src('public/**')
                  .pipe(dest('build/', { overwrite: true }))

    // const js = src('tmp/*.js')
    //               .pipe(dest('build/', { overwrite: true }))


    // const js = src('src/*.js')
    //               .pipe(browserify({
    //                 insertGlobals: 'Game'
    //               }))

    return merge(html, bundle())
}

exports.liveDev = liveDev