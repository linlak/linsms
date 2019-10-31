define(['app'],function(app){
    'use strict';
    app.value('storageKey','ugsalons_ofline_storage');
    app.factory('storage',['$exceptionHandler','$window','storageKey',function provideStorage( $exceptionHandler, $window, storageKey ){
        var items = loadData();
        var persistHooks = [];
        var persistEnabled = true;
        $window.addEventListener( "beforeunload", persistData );       
        return({
            clear: clear,
            disablePersist: disablePersist,
            enablePersist: enablePersist,
            extractItem: extractItem,
            getItem: getItem,
            onBeforePersist: onBeforePersist,
            removeItem: removeItem,
            setItem: setItem
        });
        function clear() {
            items = {};
        }
        function disablePersist() {
            persistEnabled = false;
        }
        function enablePersist() {
            persistEnabled = true;
        }
        function extractItem( key ) {
            var value = getItem( key );
            removeItem( key );
            return( value );
        }
        function getItem( key ) {
            key = normalizeKey( key );
            return( ( key in items ) ? angular.copy( items[ key ] ) : null );
        }
        function onBeforePersist( operator ) {
            persistHooks.push( operator );
        }
        function removeItem( key ) {
            key = normalizeKey( key );
            delete( items[ key ] );
        }
        function setItem( key, value ) {
            key = normalizeKey( key );
            items[ key ] = angular.copy( value );
        }
        function loadData() {
            try {
                if ( storageKey in $window.sessionStorage ) {
                    var data = $window.sessionStorage.getItem( storageKey );
                    $window.sessionStorage.removeItem( storageKey );
                    return( angular.extend( {}, angular.fromJson( data ) ) );
                }
            } catch ( sessionStorageError ) {
                $exceptionHandler( sessionStorageError );
            }
            return( {} );
        }
        function normalizeKey( key ) {
            return( "storage_" + key );
        }
        function persistData() {
            for ( var i = 0, length = persistHooks.length ; i < length ; i++ ) {
                try {
                    persistHooks[ i ]();
                } catch ( persistHookError ) {
                    $exceptionHandler( persistHookError );
                }
            }
            if ( ! persistEnabled ) {
                return;
            }
            try {
                $window.sessionStorage.setItem( storageKey, angular.toJson( items ) );
            } catch ( sessionStorageError ) {
                $exceptionHandler( sessionStorageError );
            }
        }
        
    }]);
});